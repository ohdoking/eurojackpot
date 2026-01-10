import sys
import re

# Read js_content from stdin
js_content = sys.stdin.read()

lines = js_content.splitlines()

start_translations_marker = "const translations = {"
end_translations_marker = "};

start_index = -1
end_index = -1

for i, line in enumerate(lines):
    if start_translations_marker in line and start_index == -1:
        start_index = i
    if start_index != -1 and line.strip() == end_translations_marker:
        end_index = i
        break

if start_index != -1 and end_index != -1:
    new_lines = lines[:start_index] + lines[end_index+1:]
    # Remove any leading blank lines after removal if necessary
    # This might remove too many if there are legitimate blank lines.
    # A more robust way would be to check the line content.
    while new_lines and new_lines[-1].strip() == '':
        new_lines.pop()
    print("\n".join(new_lines))
else:
    print(js_content) # If not found, print original content (error case)
