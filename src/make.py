#!/usr/bin/env python

from jinja2 import Environment, FileSystemLoader


class MakeEnvironment(object):
    def __init__(self):
        self.template_env = Environment(loader=FileSystemLoader("templates"))

    def write_template(self, template_name, dest, ctxt=None):
        if ctxt is None:
            ctxt = {}
        template = self.template_env.get_template(template_name)
        out = template.render(**ctxt)
        with open(dest, "w") as out_file:
            out_file.write(out)


def main():
    make_env = MakeEnvironment()

    make_env.write_template("index.html", "../index.html")
    make_env.write_template("blog.html", "../blog.html")
    make_env.write_template("resume.html", "../resume.html")


if __name__ == "__main__":
    main()
