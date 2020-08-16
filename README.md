# file-shuffler

This is a CLI tool that does one thing: shuffles all files in a directory.
It does this by prepending all file names in a directory with a random
sequential number.

## Installation

First, you'll need to install Node JS v8 or newer. Then install this package
globally:

```
npm i -g file-shuffler
```

## Usage

The CLI tool is accessed via the `shuffle` command.
By default, the current directory is used to search for files to shuffle.

You can run `shuffle` more than once in the same directory and files
will be re-shuffled without adding duplicate prefixes.

E.g.:

```
Before      | After
------------|-------------
five.txt    | 3__five.txt
four.txt    | 2__four.txt
one.txt     | 4__one.txt
three.txt   | 1__three.txt
two.txt     | 5__two.txt
```

If the number of files in a directory falls into multiple digits,
the number prefixes will be zero-padded (e.g., `05`, `0017`, etc).

### `shuffle ./my/dir`

Calling `shuffle` followed by the name of a directory will target that
folder to search for files inside. This can be absolute or relative.

### `shuffle -s "--"` or `shuffle --separator "--"`

Specify a character (or characters) to use as a separator between the
prefix number and the rest of the file name.

E.g.: `shuffle -s "@@@"` would result in files looking like:
`5@@@filename.txt`.

### `shuffle --dry`

Dry run mode, useful to see which files would be renamed without actually
renaming any. Good to run once before running `shuffle`.

### `shuffle --forceShuffle`

Usually, `shuffle` will detect existing number and separator prefixes in
files and will replace those prefixes with new ones. If `--forceShuffle`
is provided, existing prefixes won't be detected and a new prefix will
always be added. This will result in stacked/duplicated prefixes if
ran multiple times.

### `shuffle --debug`

Runs in normal shuffle mode with extra logging.
