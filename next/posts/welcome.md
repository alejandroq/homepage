id = "welcome"
title = "Welcome"
published = true
preview = '''
This is a preview of code:

```rust
#[wasm_bindgen]
pub fn get_post_from_toml(text: &str) -> String {
    match Post::from_toml(text) {
        Ok(post) => {
            match serde_json::to_string(&post) {
                Ok(val) => val,
                _ => DEFAULT_NOT_FOUND_POST.to_string()
            }
        },
        _ => DEFAULT_NOT_FOUND_POST.to_string()
    }
}
```
'''

contents = """

### Hello, World!

This is Alejandro Quesada and this is my story.

```sh
$ code
```

"""