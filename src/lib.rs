extern crate markdown;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Post {
    id: String,
    title: String,
    published: bool,
    preview: String,
    contents: String
}

impl Post {
    pub fn from_toml(text: &str) -> Result<Post, toml::de::Error> {
        let mut post = toml::from_str::<Post>(text)?;
        post.contents = markdown::to_html(&post.contents);
        post.preview = markdown::to_html(&post.preview);
        Ok(post)
    }
}

const DEFAULT_NOT_FOUND_POST: &str = r#"
{
    "id": "404",
    "title": "Not found",
    "published": false,
    "preview": "",
    "contents": ""
}
"#;

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

#[cfg(test)]
mod tests {
    use super::{get_post_from_toml, Post};

    const MOCK_TOML_POST: &str = r#"
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
contents = '''
# Welcome

This is Alejandro Quesada and this is my story.
'''
    "#;

    #[test]
    fn should_get_post_from_toml() {
        let post_str = get_post_from_toml(MOCK_TOML_POST);
        let post: Post = serde_json::from_str(&post_str).unwrap();
        assert_eq!(&post.id, "welcome");
        assert_eq!(&post.title, "Welcome");
        assert_eq!(post.preview.contains("preview of code"), true);
        assert_eq!(&post.contents, "<h1 id=\'welcome\'>Welcome</h1>\n\n<p>This is Alejandro Quesada and this is my story.</p>\n");
        assert_eq!(post.published, true);
    }

    #[test]
    fn should_not_get_post_from_incomplete_toml() {
        let post_str = get_post_from_toml(r#"
title = "Welcome"
        "#);
        let post: Post = serde_json::from_str(&post_str).unwrap();
        assert_eq!(&post.title, "Not found");
        assert_eq!(post.published, false);
    }
}
