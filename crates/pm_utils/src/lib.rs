pub fn vec_to_array<T, const N: usize>(v: Vec<T>) -> [T; N] {
    v.try_into().unwrap_or_else(|v: Vec<T>| {
        panic!("Expected a Vec of length {} but got length {}", N, v.len())
    })
}

mod test {
    #[test]
    fn test_vta() {
        let vec = vec![1, 2, 3, 4, 5];
        let _: [usize; 5] = super::vec_to_array(vec);
    }

    #[test]
    #[should_panic]
    fn test_vta_2() {
        let vec = vec![1, 2, 3, 4, 5];
        let _: [usize; 4] = super::vec_to_array(vec);
    }
}
