#!/usr/bin/env python

import logging
import glob
import os
import os.path

from jinja2 import Environment, FileSystemLoader
import mistune
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.styles import get_style_by_name
from pygments.formatters import HtmlFormatter
import yaml


class HighlightRenderer(mistune.Renderer):
    def block_code(self, code, lang):
        if not lang:
            return "\n<pre><code>%s</code></pre>\n" % mistune.escape(code)

        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter()

        return highlight(code, lexer, formatter)


class MakeEnvironment(object):
    def __init__(self):
        self.template_env = Environment(loader=FileSystemLoader("templates"))
        self.markdown = mistune.Markdown(renderer=HighlightRenderer())

    def write_template(self, template_name, dest, ctxt=None):
        dirname = os.path.dirname(dest)
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        logging.info("Writing out generated file (%s)", dest)
        if ctxt is None:
            ctxt = {}
        template = self.template_env.get_template(template_name)
        out = template.render(**ctxt)
        with open(dest, "w") as out_file:
            out_file.write(out)

    def generate_post(self, src):
        with open(src) as post_file:
            text = post_file.read()
        return self.markdown.render(text)


def main():
    logging.basicConfig(level=logging.INFO)

    make_env = MakeEnvironment()

    with open("posts.yaml") as posts_file:
        posts = yaml.safe_load(posts_file.read())

    make_env.write_template("index.html", "../index.html")
    make_env.write_template("posts.html", "../posts/index.html", {
        "posts": posts,
    })
    make_env.write_template("resume.html", "../resume/index.html")


    for post in posts:
        post_html = make_env.generate_post(
            os.path.join("posts", "{}.md".format(post["name"])
        ))
        make_env.write_template(
            "post.html",
            "../posts/{}/index.html".format(post["name"]),
            {
                "title": post["title"],
                "date": post["date"],
                "post": post_html,
                "published": post.get("published", False),
            }
        )


if __name__ == "__main__":
    main()
