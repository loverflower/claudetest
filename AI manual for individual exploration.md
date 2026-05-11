## **AI tooling setup for developers**

**Overview:**

This guide explains how to start using AI-assisted development tools in a way that works across different projects, stacks, and maturity levels.

**What you will do:**

1. Create a project map for the existing code base  
2. Connect a few high-value tools  
3. Refine the task  
4. Build a development plan for the agent  
5. Review the plan  
6. Implement  
7. Run automated review  
8. Complete manual review

### **Principles**

* Prefer the tooling already used successfully by your project or team.  
* Make sure you use only tools approved by Client & Delivery Manager.
* Do not block adoption on a perfect setup. Start with the minimum useful flow and improve it over time.  
* Keep human review in the loop for implementation, code review, and rollout. Agents hallucinate \- humans are responsible for results.

---

## 

# 1\. Create a project map

*The purpose of this step is to decompose the repository into a format that AI agents can understand and navigate efficiently.*

*If your project already has a repository map, architecture overview, or similar context document, use it.*

### 1.1. Add [**Cartograph**](https://github.com/kingbootoshi/cartographer/tree/main/plugins/cartographer/skills/cartographer) Skill or an equivalent repository-mapping tool to create a structured map of the project. 

You’ll need to add the Skill to your repository:

| Need | Claude Code | GitHub Copilot | Cursor |
| :---: | :---: | :---: | :---: |
| Skill | `.claude/skills/Cartograph/SKILL.md` | `.github/prompts/Cartograph.prompt.md` | `.cursor/skills/Cartograph/SKILL.md` |

You can adapt this script to your non-Claude setup using AI or find analog.

### 1.2. Invoke the skill:

`/cartographer`

### Expected Outcome:

A Markdown file describing the repository structure, major modules, key entry points, and important relationships. It should appear in your CLAUDE.md file. If you are not using Claude, make sure this line is added to your *.github/[copilot-instructions.md](http://copilot-instructions.md)* for **GitHub Copilot**  or *.cursor/rules/\*.mdc* for **Cursor**

*“For detailed architecture, see [docs/CODEBASE\_MAP.md](https://github.com/invivoax/rag-chatbot/blob/b534668b9965434b4232a2424f54fa9747d94e30/docs/CODEBASE_MAP.md).”*

| Need | Claude Code | GitHub Copilot | Cursor |
| :---: | :---: | :---: | :---: |
| Always-on project guidance | `.claude/CLAUDE.md` | `.github/copilot-instructions.md` | `.cursor/rules/*.mdc` |

---

# 

# 2\. Connect core tools through MCP to get Task info conveniently 

*To reduce manual work, connect a small set of high-value tools from your task tracker through MCP. Start with 3 tools that provide the most useful delivery context: find issues, get issue, get discussion context.* 

*If your project already exposes equivalent capabilities through another platform, use that instead of forcing a new standard.* 

### 2.1. Pick the MCP server

* Prefer the tracker’s official MCP server when one exists.  
* Use a local proxy or custom server only if your tool does not provide a native remote MCP server.  
* Linear provides an official remote MCP server, Asana provides an official MCP server, and Atlassian provides the Atlassian Rovo MCP Server for Jira and related products.

### 2.2. Add the server in your AI client

* In most clients, this is done from the MCP or Tools settings.  
* You either:  
  * install a marketplace entry / one-click integration, or  
  * add a manual MCP config entry.  
  * GitHub Copilot supports adding MCP servers from its MCP marketplace or by editing MCP configuration directly, and Cursor supports adding servers from its Tools & MCP UI.

### 2.3. Authenticate

* Most hosted task-tracker MCP servers use **OAuth**.  
* Some also support API tokens or PATs for advanced setups.  
* GitHub’s remote MCP flow commonly uses OAuth, Atlassian Rovo uses OAuth 2.1 by default, and Asana prompts you to authorize access to your Asana account. 

| Capability | Linear | Jira | GitHub | Asana |
| :---: | :---: | :---: | :---: | :---: |
| **Search/list work** | List Issues | Search Issues (JQL) | List Issues | Find Tasks |
| **Open one item** | Get Issue | Get Issue | Get Issue | Get Task |
| **Discussion context** | Get Comments | Add/Get issue discussion context via comments | Add Issue Comment | Task conversation / summaries |

### Expected Outcome:

You should be able to retrieve tasks information without leaving IDE.  
---

# 3\. Refine the task for agent use

*Before handing work to an agent, rewrite the task so it is operationally clear. This is one of the highest-leverage steps. Better task definition usually produces better AI output.*

*A good agent-ready task should include:*

* *The objective*  
* *Scope and non-scope*  
* *Constraints*  
* *Relevant files or areas of the codebase*  
* *Acceptance criteria*  
* *Links to issue and project context*

*If your team uses a **Definition of Ready** check or a similar skill, run it here.* 

### 3.1. Add another [Skill](https://ventionteamsinc.sharepoint.com/:f:/s/DMO/IgBHIAxvrBn4Q7aB1BxvqysJATil3rBt7xGK9nLzOVCf7qw?e=o8bGzf).

### 3.2. Initiate DoR check:

`/dor`

### 3.3. Provide the best possible answers for all questions. 

### Expected Outcome:

You should get a comprehensive specification for a task that you can use as a prompt for future steps.  
---

# 4\. Use an agent to start planning

*Planning is a read-only mode where agents will access the task and give you a comprehensive summary of what needs to be changed. It is a safe way to see agents in action.*

*For planning it make sense to use more powerful models.* 

### 4.1. Initiate planning:

`/plan [insert spec you got after DoR check]`

| Tool | Planning step |
| :---: | :---: |
| **Claude Code** | Use **Plan Mode** |
| **GitHub Copilot** | Use **Plan mode** with `Shift+Tab` or `/plan` |
| **Cursor** | Use **Plan Mode** |

### Expected Outcome:

The agent will present a plan for implementation and validation.

---

# 5\. Validate plan

*Agents can make incorrect assumptions or produce inaccurate output, so validate the result before approving the next step.*

*For implementation it make sense to use faster/cheaper models.*

### 5.1. Review the plan 

Build a habit of checking the plan before you approve it. At a bare minimum, review about 80% of the content.

### 5.2. Validate that the agent: 

* doesn’t overcomplicate things   
* doesn’t go into cases that are not required for the task 

### 5.3. Implement the plan:

| Tool | How to start implementation |
| ----- | ----- |
| **Claude Code** | Approve the proposal, then let Claude proceed with edits |
| **GitHub Copilot** | After reviewing the generated plan, ask Copilot to implement it |
| **Cursor** | Click **Build** after approving the plan |

### Expected Outcome:

The expected outcome is a scoped, reviewable implementation that satisfies the approved plan, meets the acceptance criteria, passes relevant validation, and is ready for code review.

---

# 6\. Test the feature 

*Before submitting code for automatic review \- quickly test that everything works.*

### 6.1. Test the feature

If something does not work, collaborate with the agent to diagnose the issue, apply a fix, and re-test until the feature meets the expected outcome.

A good loop is:

1. describe what failed  
2. share the error, logs, or unexpected behavior  
3. ask the agent to identify the likely cause  
4. implement the fix  
5. re-test the feature

### Expected Outcome:

* the feature works end-to-end  
* relevant tests pass, or failures are understood

---

# 7\. Automatic Code review on GitHub

*Before a person spends time reviewing a change, let a machine review it first.*

*Specialized tools such as CodeRabbit are designed for this, but the same step can also be done with other AI-enabled review tools.*

*If you need to set up automatic code review yourself, the goal is to have an AI agent review the change set before human review begins. The review should produce:*

1. *a summary of what changed*  
2. *potential risks or regressions*  
3. *missing tests or validation gaps*  
4. *edge cases or non-obvious issues that a human reviewer might overlook*

*Automated review does not replace manual review. It improves it by surfacing issues early and giving the reviewer a faster way to understand the change.*

*For setup instructions, search for: “How do I configure code review with \[tool name\]”.*

### 7.1. Initiate automatic code review

### Expected Outcome:

The agent will likely suggest **many possible improvements**, including some that are not important right now. Use common sense to focus on the issues that are relevant to your project and current scope.

---

# 8\. Perform manual code review

*AI can accelerate delivery, but ownership remains with the team. Manual review is still required. Agents can occasionally produce inaccurate or misleading output, so human review is necessary to catch issues before changes move forward.*

### 8.1. Perform code review

Apply the same expectations to code review that you apply to the project in general.

### Expected Outcome:

Code that is maintainable for both humans and agents.

---

