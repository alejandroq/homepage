use markdown;
use nipper::Document;
use regex::Regex;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct Post {
    id: String,
    title: String,
    published: bool,
    preview: String,
    contents: String,
}

impl Post {
    pub fn from_toml(text: &str) -> Result<Post, toml::de::Error> {
        let mut post = toml::from_str::<Post>(text)?;
        post.contents = Post::markdown_to_html(&post.contents);
        post.preview = Post::markdown_to_html(&post.preview);
        Ok(post)
    }

    fn markdown_to_html(input: &str) -> String {
        vec![input]
            .iter()
            .map(|contents| markdown::to_html(contents))
            .map(|html| Post::translate_img_html_tags_markdown_sizes(&html))
            .collect()
    }

    fn translate_img_html_tags_markdown_sizes(html_str: &str) -> String {
        let document: Document = Document::from(html_str);
        let re = Regex::new(r"/(.*).jpeg\s=([0-9]*)(px|x)").unwrap();

        // the markdown to html occasionally places img tags within p tags so we are compensating for it here
        document.select("p").iter().for_each(|mut p| {
            p.select("img").iter().for_each(|img| {
                p.replace_with_html(img.html());
            })
        });

        document.select("img").iter().for_each(|mut img| {
            let href = img.attr_or("src", "");
            for cap in re.captures_iter(&href) {
                println!("{:?}", cap);
                img.set_attr("src", &format!("/{}.jpeg", &cap[1]));
                img.set_attr("width", &format!("{}px", &cap[2]));
            }
        });

        document
            .select("body > *")
            .iter()
            .map(|el| el.html())
            .fold("".to_string(), |html, el| format!("{}{}", &html, &el))
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
        Ok(post) => match serde_json::to_string(&post) {
            Ok(val) => val,
            _ => DEFAULT_NOT_FOUND_POST.to_string(),
        },
        _ => DEFAULT_NOT_FOUND_POST.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::{get_post_from_toml, Post};
    use nipper::Document;
    use serde_json;

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
'''"#;

    #[test]
    fn should_get_post_from_toml() {
        let post_str = get_post_from_toml(MOCK_TOML_POST);
        let post: Post = serde_json::from_str(&post_str).unwrap();
        assert_eq!(&post.id, "welcome");
        assert_eq!(&post.title, "Welcome");
        assert_eq!(post.preview.contains("preview of code"), true);
        assert_eq!(&post.contents, "<h1 id=\"welcome\">Welcome</h1>\n\n<p>This is Alejandro Quesada and this is my story.</p>\n");
        assert_eq!(post.published, true);
    }

    #[test]
    fn should_not_get_post_from_incomplete_toml() {
        let post_str = get_post_from_toml(
            r#"
title = "Welcome"
        "#,
        );
        let post: Post = serde_json::from_str(&post_str).unwrap();
        assert_eq!(&post.title, "Not found");
        assert_eq!(post.published, false);
    }

    #[test]
    fn should_update_img_tag_width_from_markdown() {
        {
            let post_str = get_post_from_toml(
                r#"
id = "test"
title = "test"
published = false
preview = '''
this is text before

![img](/img.jpeg =200px)
'''
contents = '''
# this is text before

![img](/img.jpeg =50px)
'''"#,
            );
            let post: Post = serde_json::from_str(&post_str).unwrap();
            assert_eq!(
                &post.contents,
                "<h1 id=\"this_is_text_before\">this is text before</h1>\n\n<img src=\"/img.jpeg\" alt=\"img\" width=\"50px\">\n"
            );
            assert_eq!(
                &post.preview,
                "<p>this is text before</p>\n\n<img src=\"/img.jpeg\" alt=\"img\" width=\"200px\">\n"
            );
        }

        {
            let post_str = get_post_from_toml(
                r#"
id = "creating-this-homepage"
title = "On creating this homepage"
published = true
preview = '''
#### Why not use an existing solution for continue to use Hugo for my personal homepage? 

As a software engineer, experimenting with "edgy" technologies is part of the joy and this homepage seemed like an appropriate location for such nonsense.
'''

contents = '''
### Tools applied and what their external uses could be

- NextJS
- WASM with Rust

[Git URL](https://github.com/alejandroq/homepage)

![image](/about_me.jpeg =250x)
'''"#,
            );
            let post: Post = serde_json::from_str(&post_str).unwrap();
            let document = Document::from(&post.contents);
            let mut img_tag_count = 0;
            document.select("img").iter().for_each(|img| {
                img_tag_count = img_tag_count + 1;
                assert_eq!(img.attr_or("src", "").to_string(), "/about_me.jpeg");
            });
            assert_eq!(img_tag_count, 1);
        }
    }
}
