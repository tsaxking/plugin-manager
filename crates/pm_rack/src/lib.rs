pub mod prelude;

use fundsp::{
    audionode::{AudioNode, Frame},
    hacker::U1,
};
use std::{collections::HashMap, sync::Arc};

#[derive(Default, Debug, serde::Serialize, serde::Deserialize)]
pub struct Rack {
    pub items: HashMap<Arc<str>, Box<dyn RackItem>>,
}

unsafe impl Send for Rack {}
unsafe impl Sync for Rack {}

pub fn init_rack(state: Rack) {
    RACK.set(std::sync::Mutex::new(state))
        .expect("Critical Error: Could not set RACK");
}

/// Used to access data from other `RackItem`s
pub static RACK: std::sync::OnceLock<std::sync::Mutex<Rack>> =
    std::sync::OnceLock::new();

pub trait IO: private::Sealed {}

/// Marker for Input type descriptors
pub struct Input {}

/// Marker for Output type descriptors
pub struct Output {}

impl IO for Input {}
impl IO for Output {}

mod private {
    pub trait Sealed {}
    impl Sealed for super::Input {}
    impl Sealed for super::Output {}
}

pub trait IoPort {
    fn is_connected(&self) -> bool;
    fn is_disconnected(&self) -> bool;
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
/// Represents the state of a given Output port
pub enum OutputPortState {
    Connected(Arc<str>),
    Disconnected,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct OutputPort {
    pub name: Arc<str>,
    pub state: OutputPortState,
}

/// Represents the state of a given input port
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum InputPortState {
    Connected,
    Disconnected,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct InputPort {
    pub name: Arc<str>,
    pub state: InputPortState,
}

impl IoPort for OutputPort {
    fn is_connected(&self) -> bool {
        match self.state {
            OutputPortState::Disconnected => false,
            OutputPortState::Connected(_) => true,
        }
    }

    fn is_disconnected(&self) -> bool {
        match self.state {
            OutputPortState::Disconnected => true,
            OutputPortState::Connected(_) => false,
        }
    }
}

impl IoPort for InputPort {
    fn is_connected(&self) -> bool {
        match self.state {
            InputPortState::Disconnected => false,
            InputPortState::Connected => true,
        }
    }

    fn is_disconnected(&self) -> bool {
        match self.state {
            InputPortState::Disconnected => true,
            InputPortState::Connected => false,
        }
    }
}

#[derive(thiserror::Error, Debug, serde::Serialize)]
pub enum RackError {
    #[error(
        "Attempted to access RACK before it was initialized. Try calling `init_rack`"
    )]
    Uninitialized,
    #[error("RACK Mutex was poisoned. Did a thread panic?")]
    Poisoned,
    #[error("RACK could not be serialized into JSON")]
    SerializeError {
        #[from]
        #[serde(skip)]
        source: serde_json::Error,
    },
}

/// Describes the type of IO for a given port or connection
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum IoKind {
    Audio,
    Midi,
    Control,
}

/// Represents a valid output for a `RackItem`. Using a `RackOutput` which does not represent a valid
/// output may result in a panic.
#[non_exhaustive]
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct RackOutput {
    kind: IoKind,
    id: usize,
}

/// Represents a valid target input on a `RackItem`. Using a `ConnectionTarget` which does not
/// represent a valid target, or if the the type of `rack_item_id` does not match T, may result in
/// a panic.
#[non_exhaustive]
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct ConnectionTarget {
    rack_item_id: Arc<str>,
    kind: IoKind,
    id: usize,
}

/// Describes a given IO port. Does not indicate that the port is valid
#[derive(Debug, Clone)]
pub struct IoDescriptor<I>
where
    I: IO,
{
    _io: std::marker::PhantomData<I>,
    kind: IoKind,
    id: usize,
}

impl<I: IO> IoDescriptor<I> {
    pub fn new(kind: IoKind, id: usize) -> Self {
        IoDescriptor {
            _io: std::marker::PhantomData::<I>,
            kind,
            id,
        }
    }
}

/// Helper storage struct for all the metadata about RackItem
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RackItemMetadata {
    pub id: Arc<str>,
    pub note: Arc<str>,
    pub point: (u8, u8),
    pub width: u8,
    pub color: Arc<str>,
}

#[typetag::serde(tag = "type")]
pub trait RackItem: std::fmt::Debug {
    /// Returns a `RackOutput<Self>` if `output` is valid. Generally, valid outputs (1) exist and
    /// (2) are not already connected to something. It is expected that the default implementation
    /// function is not possible to override.
    fn get_valid_output(&self, output: IoDescriptor<Output>) -> Option<RackOutput> {
        if self.is_output_valid(&output) {
            Some(RackOutput {
                kind: output.kind,
                id: output.id,
            })
        } else {
            None
        }
    }

    /// Returns a `ConnectionTarget<Self>` if `input` is valid. Generally, valid inputs (1) exist and
    /// (2) are not already connected to something. It is expected that the default implementation
    /// function is not possible to override.
    fn get_connection_target(
        &self,
        input: IoDescriptor<Input>,
    ) -> Option<ConnectionTarget> {
        if self.is_input_valid(&input) {
            Some(ConnectionTarget {
                rack_item_id: self.metadata().id.clone(),
                kind: input.kind,
                id: input.id,
            })
        } else {
            None
        }
    }

    /// Returns the metadata of the RackItem
    fn metadata(&self) -> &RackItemMetadata;

    /// Used by `RackItem::get_valid_output` to determine if the output is valid. Generally, a
    /// valid output (1) exists and (2) is not already connected to something.
    fn is_output_valid(&self, output: &IoDescriptor<Output>) -> bool;

    /// Used by `RackItem::get_connection_target` to determine if the input is valid. Generally, a
    /// valid input (1) exists and (2) is not already connected to something.
    fn is_input_valid(&self, input: &IoDescriptor<Input>) -> bool;

    /// Connect a given RackOutput to the target RackItem.
    fn connect_output(&mut self, output: RackOutput, target: ConnectionTarget);

    /// Accept a connection to the given input port.
    fn accept_connection(&mut self, kind: IoKind, id: usize);

    /// Get a list of outputs to the RackItem
    fn get_outputs(&self) -> Vec<IoDescriptor<Output>>;

    /// Get a list of inputs to the RackItem
    fn get_inputs(&self) -> Vec<IoDescriptor<Input>>;
}

/// Helper struct for dealing with a certain IoKind. Each `RackItem` implementor should only have
/// one IoComponent per IoKind. Either array may be empty to indicate that there are no ports.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct IoComponent<const I: usize, const O: usize> {
    #[serde(with = "serde_arrays")]
    inputs: [InputPort; I],
    #[serde(with = "serde_arrays")]
    outputs: [OutputPort; O],
}

impl<const I: usize, const O: usize> IoComponent<I, O> {
    pub fn new() -> Self {
        let mut o_buf: Vec<OutputPort> = vec![];
        for _ in 0..O {
            o_buf.push(OutputPort {
                name: "PORT NAME".into(),
                state: OutputPortState::Disconnected,
            });
        }

        let mut i_buf: Vec<InputPort> = vec![];
        for _ in 0..I {
            i_buf.push(InputPort {
                name: "PORT NAME".into(),
                state: InputPortState::Disconnected,
            });
        }

        IoComponent {
            inputs: pm_utils::vec_to_array(i_buf),
            outputs: pm_utils::vec_to_array(o_buf),
        }
    }
}

impl<const I: usize, const O: usize> Default for IoComponent<I, O> {
    fn default() -> Self {
        Self::new()
    }
}

/// This is an example implementation of RackItem. Note that all RackItems should implement the
/// following traits:
/// - `serde::Serialize`
/// - `serde::Deserialize`
/// - `fundsp::audionode::AudioNode`
///
/// Due to [limitations in serializing trait objects](https://github.com/dtolnay/typetag/issues/1), `RackItem` implementors cannot be generic.
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct ExampleRackItem {
    metadata: RackItemMetadata,
    audio: IoComponent<1, 1>,
    midi: IoComponent<1, 1>,
    control: IoComponent<1, 1>,
}

impl AudioNode for ExampleRackItem {
    const ID: u64 = 999;
    type Sample = f32;
    type Inputs = U1;
    type Outputs = U1;
    type Setting = ();

    fn tick(
        &mut self,
        input: &Frame<Self::Sample, Self::Inputs>,
    ) -> Frame<Self::Sample, Self::Outputs> {
        *input
    }
}

impl Default for ExampleRackItem {
    fn default() -> Self {
        let metadata = RackItemMetadata {
            id: "SELF".into(),
            note: "SELFNOTE".into(),
            point: (0, 0),
            width: 8,
            color: "SELF COLOR".into(),
        };

        let mut s = Self {
            metadata,
            audio: IoComponent::<1, 1>::new(),
            midi: IoComponent::<1, 1>::new(),
            control: IoComponent::<1, 1>::new(),
        };

        s.audio.outputs[0] = OutputPort {
            name: "PORT NAME".into(),
            state: OutputPortState::Connected("OTHER".into()),
        };
        s
    }
}

#[typetag::serde]
impl RackItem for ExampleRackItem {
    fn is_output_valid(&self, output: &IoDescriptor<Output>) -> bool
    where
        Self: Sized,
    {
        output.kind == IoKind::Audio
            && output.id <= 1
            && self.audio.outputs[output.id].is_disconnected()
    }

    fn connect_output(&mut self, output: RackOutput, target: ConnectionTarget) {
        self.audio.outputs[output.id].state =
            OutputPortState::Connected(target.rack_item_id.clone());
        let mut lock_guard = RACK.get().unwrap().lock().unwrap();
        let other = lock_guard.items.get_mut(&*target.rack_item_id).unwrap();
        other.accept_connection(output.kind, target.id);
    }

    fn metadata(&self) -> &RackItemMetadata {
        &self.metadata
    }

    fn is_input_valid(&self, input: &IoDescriptor<Input>) -> bool
    where
        Self: Sized,
    {
        input.kind == IoKind::Audio
            && input.id <= 1
            && self.audio.inputs[input.id].is_disconnected()
    }

    fn accept_connection(&mut self, kind: IoKind, id: usize) {
        match kind {
            IoKind::Audio => self.audio.inputs[id].state = InputPortState::Connected,
            IoKind::Midi => self.midi.inputs[id].state = InputPortState::Connected,
            IoKind::Control => {
                self.control.inputs[id].state = InputPortState::Connected
            }
        }
    }

    fn get_outputs(&self) -> Vec<IoDescriptor<Output>> {
        let mut out = vec![];
        for id in 0..self.audio.outputs.len() {
            out.push(IoDescriptor::<Output>::new(IoKind::Audio, id));
        }
        for id in 0..self.midi.outputs.len() {
            out.push(IoDescriptor::<Output>::new(IoKind::Midi, id));
        }
        for id in 0..self.control.outputs.len() {
            out.push(IoDescriptor::<Output>::new(IoKind::Control, id));
        }
        out
    }

    fn get_inputs(&self) -> Vec<IoDescriptor<Input>>
    where
        Self: Sized,
    {
        let mut out = vec![];
        for id in 0..self.audio.inputs.len() {
            out.push(IoDescriptor::<Input>::new(IoKind::Audio, id));
        }
        for id in 0..self.midi.inputs.len() {
            out.push(IoDescriptor::<Input>::new(IoKind::Midi, id));
        }
        for id in 0..self.control.inputs.len() {
            out.push(IoDescriptor::<Input>::new(IoKind::Control, id));
        }
        out
    }
}
