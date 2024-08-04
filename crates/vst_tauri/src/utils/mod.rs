use futures_util::StreamExt;
use tokio::net;
use std::fmt::Debug;
use std::net::UdpSocket;
use std::collections::HashMap;

pub async fn start_server() {
    let addr = "127.0.0.1:8080".to_string();
    // Create the event loop and TCP listener we'll accept connections on.
    let try_socket = net::TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(accept_connection(stream));
    }
} 
pub async fn accept_connection(stream: net::TcpStream) {
    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during the websocket handshake occurred");
    let (write, read) = ws_stream.split();
    if let Err(e) = read.forward(write).await {
        eprintln!("Error: {}", e);
    }
}



#[derive(Debug)]
pub struct Server {
    socket: UdpSocket,
    listeners: HashMap<String, Vec<fn(String)>>,
}


impl Server {
    pub fn new(addr: &str) -> Server {
        let socket = UdpSocket::bind(addr).unwrap();
        Server {
            socket,
            listeners: HashMap::new(),
        }
    }

    pub fn listen(&self) {
        loop {
            let mut buf = [0; 1024];
            let (amt, _src) = self.socket.recv_from(&mut buf).unwrap();
            let message = String::from_utf8_lossy(&buf[..amt]);
            let parts: Vec<&str> = message.split(":").collect();
            let event = parts[0];
            // payload is the rest of the message, it can of any length
            let payload = parts[1..].join(":");
            if self.listeners.contains_key(event) {
                for callback in self.listeners.get(event).unwrap() {
                    callback(payload.to_string());
                }
            }
        }
    }

    pub fn send(&self, event: &str, payload: &str) {
        let message = String::from(event) + ":" + payload;
        self.socket.send(message.as_bytes()).unwrap();
    }

    pub fn on(&mut self, event: &str, callback: fn(String)) {
        if self.listeners.contains_key(event) {
            self.listeners.get_mut(event).unwrap().push(callback);
        } else {
            self.listeners.insert(event.to_string(), vec![callback]);
        }
    }

    pub fn off(&mut self, event: &str, callback: fn(String)) {
        if self.listeners.contains_key(event) {
            let listeners = self.listeners.get_mut(event).unwrap();
            let index = listeners.iter().position(|&x| x == callback);
            if index.is_some() {
                listeners.remove(index.unwrap());
            }
        }
    }
}