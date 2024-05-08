pub mod test_state_schema;

#[cfg(test)]
#[derive(Debug)]
struct IgnoreWhitespace<'a> {
    string: &'a str,
}

#[cfg(test)]
impl<'a> PartialEq for IgnoreWhitespace<'a> {
    fn eq(&self, other: &Self) -> bool {
        let mut self_iter = self.string.chars();
        let mut other_iter = other.string.chars();

        while let (Some(mut self_c), Some(mut other_c)) =
            (self_iter.next(), other_iter.next())
        {
            while self_c.is_whitespace() {
                let opt_c = self_iter.next();
                if opt_c.is_some() {
                    self_c = opt_c.unwrap();
                }
            }

            while other_c.is_whitespace() {
                let opt_c = other_iter.next();
                if opt_c.is_some() {
                    other_c = opt_c.unwrap();
                }
            }

            if self_c != other_c {
                return false;
            }
        }

        true
    }
}

#[test]
fn deserialize_app_state() {
    let json_str = std::fs::read_to_string("./scripts/serialized.json").unwrap();
    let deserializer = &mut serde_json::Deserializer::from_str(&json_str);
    let result: Result<Vec<crate::RackItem>, _> =
        serde_path_to_error::deserialize(deserializer);
    match result {
        Ok(actual) => {
            let expected = crate::tests::test_state_schema::get();
            assert_eq!(actual, expected);
        }
        Err(e) => {
            let path = e.path().to_string();
            eprintln!("{path:?}");
            panic!("{e:?}");
        }
    }
}

#[test]
fn serialize_app_state() {
    let schema = crate::tests::test_state_schema::get();
    let actual = serde_json::to_string(&schema).unwrap().to_string();
    let expected = std::fs::read_to_string("./scripts/serialized.json").unwrap();

    let left = IgnoreWhitespace { string: &actual };
    let right = IgnoreWhitespace { string: &expected };
    assert_eq!(left, right);
}
