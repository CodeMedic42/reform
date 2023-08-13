# reform

Rush workflow
https://rushjs.io/pages/maintainer/publishing/

Notes:
    "rush change --verify" only works when rush has two things to compare. Running just the base command requires unpushed git changes which either are staged or already committed. The effect is that rush can see the staged/commit changes against the remove version of the branch. Id however the changes are not staged(even though they have been changed) or the changes are pushed to the remote server, then rush will not see the difference and the verify command will pass when it was expected to fail.

There are two ways to handle this

1. Setup a git hook to run fail commit when "rush change --verify" fails.
2. Prevent checking directly into main and require "rush change --verify" to pass when merging into main from a PR.(Recommended)