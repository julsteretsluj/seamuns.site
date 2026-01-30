#!/bin/bash

# Array of pages to create with their titles and icons
declare -A pages=(
    ["how-to-host"]="How to Host an MUN|fas fa-building"
    ["participating-schools"]="Participating Schools|fas fa-graduation-cap"
    ["become-participating-school"]="How to Become a Participating School|fas fa-handshake"
    ["delegate-signup"]="Delegate Sign Up Guide|fas fa-user-plus"
    ["individual-delegates"]="Individual Delegates|fas fa-user"
    ["mun-guide"]="MUN Guide|fas fa-book"
    ["how-to-prep"]="How to Prep for MUN|fas fa-clipboard-list"
    ["stand-out"]="How to Stand Out|fas fa-star"
    ["confidence"]="Confidence Building|fas fa-heart"
    ["support"]="Support at Conferences|fas fa-hands-helping"
    ["chair-guide"]="Chair Application Guide|fas fa-gavel"
    ["advisor-guide"]="Advisor Guide|fas fa-chalkboard-teacher"
    ["points"]="Points|fas fa-list-ol"
    ["motions"]="Motions|fas fa-hand-paper"
    ["conduct"]="Conduct and Decorum|fas fa-balance-scale"
    ["speeches"]="Speeches|fas fa-microphone"
    ["resolutions"]="Resolutions|fas fa-file-alt"
    ["crisis"]="Crisis Committees|fas fa-exclamation-triangle"
    ["ga"]="General Assembly|fas fa-globe-americas"
    ["position-papers"]="Position Papers|fas fa-file-word"
    ["examples"]="Examples|fas fa-lightbulb"
    ["awards"]="Awards|fas fa-trophy"
    ["templates"]="Templates|fas fa-file-download"
    ["contact"]="Contact Us|fas fa-envelope"
)

echo "Created pages list"
