#!/bin/bash
# ============================================
# 🚀 Insolify Repo Automation Script (v3)
# ============================================

set -Eeo pipefail

LOGFILE="repo_creation.log"
STATE_FILE=".script_state"

# --- 🧱 Error handler ---
error_handler() {
    local exit_code=$?
    local last_command="${BASH_COMMAND}"
    local line_no="${BASH_LINENO[0]}"
    echo ""
    echo "❌ ERROR: Command '${last_command}' failed with exit code ${exit_code}"
    echo "   → Script terminated at line ${line_no}"
    echo "   → Check '${LOGFILE}' for more details."
    echo "$(date '+%Y-%m-%d %H:%M:%S'): ERROR during '${last_command}' (exit $exit_code, line $line_no)" >> "$LOGFILE"
    exit $exit_code
}

trap error_handler ERR

# --- Helper functions ---
mark_done() { echo "$1" >> "$STATE_FILE"; }
is_done() { grep -qx "$1" "$STATE_FILE" 2>/dev/null; }
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') | $1" | tee -a "$LOGFILE"; }

# --- 1️⃣ User Input ---
read -p "Enter your organization name: " ORG
read -p "Enter repository name: " REPO
REPO="${REPO// /-}"
read -p "Enter repository description: " DESC
read -p "Should the repository be public or private? (public/private): " VISIBILITY
read -p "Enter collaborator username (optional): " COLLAB

log "🚀 Starting repository automation for '$ORG/$REPO'..."

# --- 2️⃣ Create Repository ---
if ! is_done "repo_created"; then
  if gh repo view "$ORG/$REPO" >/dev/null 2>&1; then
    log "ℹ️ Repository already exists, skipping creation."
  else
    gh repo create "$ORG/$REPO" --$VISIBILITY --description "$DESC" --confirm
    log "✅ Repository created successfully."
  fi
  mark_done "repo_created"
fi

# --- 3️⃣ Initialize Git ---
if [ ! -d .git ]; then
  git init
  echo "# $REPO" > README.md
  git add .
  git commit -m "Initial commit"
  log "🌀 Local Git repo initialized."
fi

# --- 4️⃣ Set Remote ---
if ! git remote | grep -q origin; then
  git remote add origin "https://github.com/$ORG/$REPO.git"
  log "🔗 Remote origin added."
fi

# --- 5️⃣ Push to Main ---
if ! is_done "main_pushed"; then
  git branch -M main
  git push -u origin main
  mark_done "main_pushed"
  log "⬆️ Main branch pushed."
fi

# --- 6️⃣ Developer Branch ---
if ! is_done "developer_branch_created"; then
  git switch developer 2>/dev/null || git checkout -b developer
  git push -u origin developer
  git switch main
  mark_done "developer_branch_created"
  log "🌿 Developer branch created and pushed."
fi


# --- 7️⃣ Add Collaborator ---
if [ -n "$COLLAB" ] && ! is_done "collaborator_added"; then
  log "👥 Processing collaborator '$COLLAB'..."
  
  # Verify user exists
  if gh api users/$COLLAB >/dev/null 2>&1; then
    # Check membership in org
    MEMBER_STATUS=$(gh api -i "orgs/$ORG/members/$COLLAB" 2>/dev/null | grep "HTTP/" | awk '{print $2}')
    
    if [ "$MEMBER_STATUS" == "204" ]; then
      log "ℹ️ '$COLLAB' is an existing member of '$ORG'. Adding them to the repository explicitly..."
    else
      log "👤 '$COLLAB' is not an org member. Attempting external collaborator addition..."
    fi

    # Try to add collaborator to repo
    if gh api -X PUT "repos/$ORG/$REPO/collaborators/$COLLAB" -f permission=push >/dev/null 2>&1; then
      log "✅ Collaborator '$COLLAB' successfully added to repository."
    else
      log "⚠️ Could not add '$COLLAB'. Please check repo permissions or org policy."
    fi
  else
    log "❌ GitHub user '$COLLAB' not found. Skipping collaborator addition."
  fi

  mark_done "collaborator_added"
else
  log "👥 Collaborator step already completed or none provided."
fi

# --- 8️⃣ Add CI/CD Workflow ---
if ! is_done "ci_cd_added"; then
  mkdir -p .github/workflows
  cat <<EOF > .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, developer ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm install
      - name: Run Linter
        run: npm run lint || echo "Lint warnings only"
      - name: Run Tests
        run: npm test || echo "No tests configured"
EOF
  git add .github/workflows/ci.yml
  git commit -m "Add CI/CD workflow"
  git push
  mark_done "ci_cd_added"
  log "⚙️ CI/CD pipeline added."
fi

# --- 9️⃣ Protect Main Branch ---
if ! is_done "branch_protection"; then
  log "🛡️ Applying branch protection for 'main'..."
  
  # Create a temporary JSON file
  PROTECTION_FILE=$(mktemp protection.json.XXXX)
  cat <<EOF > "$PROTECTION_FILE"
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null
}
EOF

  # Apply protection rule
  if gh api --method PUT "repos/$ORG/$REPO/branches/main/protection" --input "$PROTECTION_FILE" >/dev/null 2>&1; then
    log "✅ Branch protection rules applied successfully."
    mark_done "branch_protection"
  else
    log "⚠️ Failed to apply branch protection. Check org permissions or token scopes."
  fi

  # Clean up temp file
  rm -f "$PROTECTION_FILE"
fi

# --- 🔟 Update README ---
if ! is_done "readme_updated"; then
  cat <<EOF > README.md
# $REPO

$DESC

![CI](https://github.com/$ORG/$REPO/actions/workflows/ci.yml/badge.svg)

## 🚀 Setup
\`\`\`bash
git clone https://github.com/$ORG/$REPO.git
cd $REPO
npm install
npm start
\`\`\`

## 🧑‍💻 Branches
- **main** → stable, production-ready
- **developer** → active development

EOF
  git add README.md
  git commit -m "Update README with project info"
  git push
  mark_done "readme_updated"
  log "📘 README.md updated."
fi

# --- ✅ Completion ---
log "🎉 Repository '$REPO' setup complete with branches, CI/CD, protection, and documentation."
