---
article: 
category: AI
tag: prompt
created: 2026-01-05 23:41:23
updated: 2026-05-05 11:01:16
---

我很常用的提示词 (收集放到 espanso 了, 方便随时用)

## Prompt

> ⭐️ Anthropics 官方学习仓库
>
> Doc 版本: https://github.com/anthropics/prompt-eng-interactive-tutorial/blob/master/Anthropic%201P/09_Complex_Prompts_from_Scratch.ipynb
>
> Excel 版本: https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?gid=1171654224#gid=1171654224

Template

```
######################################## INPUT VARIABLES ########################################

# Input variable - the code that Claude needs to read and assist the user with correcting
CODE = """
# Function to print multiplicative inverses
def print_multiplicative_inverses(x, n):
  for i in range(n):
    print(x / i) 
"""



######################################## PROMPT ELEMENTS ########################################

##### Prompt element 1: `user` role
# Make sure that your Messages API call always starts with a `user` role in the messages array.
# The get_completion() function as defined above will automatically do this for you.

##### Prompt element 2: Task context
# Give Claude context about the role it should take on or what goals and overarching tasks you want it to undertake with the prompt.
# It's best to put context early in the body of the prompt.
TASK_CONTEXT = ""

##### Prompt element 3: Tone context
# If important to the interaction, tell Claude what tone it should use.
# This element may not be necessary depending on the task.
TONE_CONTEXT = ""

##### Prompt element 4: Detailed task description and rules
# Expand on the specific tasks you want Claude to do, as well as any rules that Claude might have to follow.
# This is also where you can give Claude an "out" if it doesn't have an answer or doesn't know.
# It's ideal to show this description and rules to a friend to make sure it is laid out logically and that any ambiguous words are clearly defined.
TASK_DESCRIPTION = ""

##### Prompt element 5: Examples
# Provide Claude with at least one example of an ideal response that it can emulate. Encase this in <example></example> XML tags. Feel free to provide multiple examples.
# If you do provide multiple examples, give Claude context about what it is an example of, and enclose each example in its own set of XML tags.
# Examples are probably the single most effective tool in knowledge work for getting Claude to behave as desired.
# Make sure to give Claude examples of common edge cases. If your prompt uses a scratchpad, it's effective to give examples of how the scratchpad should look.
# Generally more examples = better.
EXAMPLES = ""

##### Prompt element 6: Input data to process
# If there is data that Claude needs to process within the prompt, include it here within relevant XML tags.
# Feel free to include multiple pieces of data, but be sure to enclose each in its own set of XML tags.
# This element may not be necessary depending on task. Ordering is also flexible.
INPUT_DATA = ""

##### Prompt element 7: Immediate task description or request #####
# "Remind" Claude or tell Claude exactly what it's expected to immediately do to fulfill the prompt's task.
# This is also where you would put in additional variables like the user's question.
# It generally doesn't hurt to reiterate to Claude its immediate task. It's best to do this toward the end of a long prompt.
# This will yield better results than putting this at the beginning.
# It is also generally good practice to put the user's query close to the bottom of the prompt.
IMMEDIATE_TASK = ""

##### Prompt element 8: Precognition (thinking step by step)
# For tasks with multiple steps, it's good to tell Claude to think step by step before giving an answer
# Sometimes, you might have to even say "Before you give your answer..." just to make sure Claude does this first.
# Not necessary with all prompts, though if included, it's best to do this toward the end of a long prompt and right after the final immediate task request or description.
PRECOGNITION = ""

##### Prompt element 9: Output formatting
# If there is a specific way you want Claude's response formatted, clearly tell Claude what that format is.
# This element may not be necessary depending on the task.
# If you include it, putting it toward the end of the prompt is better than at the beginning.
OUTPUT_FORMATTING = ""

##### Prompt element 10: Prefilling Claude's response (if any)
# A space to start off Claude's answer with some prefilled words to steer Claude's behavior or response.
# If you want to prefill Claude's response, you must put this in the `assistant` role in the API call.
# This element may not be necessary depending on the task.
PREFILL = ""



######################################## COMBINE ELEMENTS ########################################

PROMPT = ""

if TASK_CONTEXT:
    PROMPT += f"""{TASK_CONTEXT}"""

if TONE_CONTEXT:
    PROMPT += f"""\n\n{TONE_CONTEXT}"""

if TASK_DESCRIPTION:
    PROMPT += f"""\n\n{TASK_DESCRIPTION}"""

if EXAMPLES:
    PROMPT += f"""\n\n{EXAMPLES}"""

if INPUT_DATA:
    PROMPT += f"""\n\n{INPUT_DATA}"""

if IMMEDIATE_TASK:
    PROMPT += f"""\n\n{IMMEDIATE_TASK}"""

if PRECOGNITION:
    PROMPT += f"""\n\n{PRECOGNITION}"""

if OUTPUT_FORMATTING:
    PROMPT += f"""\n\n{OUTPUT_FORMATTING}"""

# Print full prompt
print("--------------------------- Full prompt with variable substutions ---------------------------")
print("USER TURN")
print(PROMPT)
print("\nASSISTANT TURN")
print(PREFILL)
print("\n------------------------------------- Claude's response -------------------------------------")
print(get_completion(PROMPT, prefill=PREFILL))
```

Answer

```
exercise_9_2_solution = """
You are Codebot, a helpful AI assistant who finds issues with code and suggests possible improvements.

Act as a Socratic tutor who helps the user learn.

You will be given some code from a user. Please do the following:
1. Identify any issues in the code. Put each issue inside separate <issues> tags.
2. Invite the user to write a revised version of the code to fix the issue.

Here's an example:

<example>
<code>
def calculate_circle_area(radius):
    return (3.14 * radius) ** 2
</code>
<issues>
<issue>
3.14 is being squared when it's actually only the radius that should be squared>
</issue>
<response>
That's almost right, but there's an issue related to order of operations. It may help to write out the formula for a circle and then look closely at the parentheses in your code.
</response>
</example>

Here is the code you are to analyze:

<code>
{CODE}
</code>

Find the relevant issues and write the Socratic tutor-style response. Do not give the user too much help! Instead, just give them guidance so they can find the correct solution themselves.

Put each issue in <issue> tags and put your final response in <response> tags.
"""
```

1. `user` role
2. Task context
3. Tone context
4. Detailed task description and rules
5. Examples
6. Input data to process
7. Immediate task description or request
8. Precognition (thinking step by step)
9. Output formatting
10. Prefilling Claude's response (if any)



## SKILL

> 
>
> SKILL market: https://skillsmp.com/
>
> ⭐️[说了很好] Doc introduction: https://datawhalechina.github.io/easy-vibe/zh-cn/stage-3/core-skills/skills/#%E4%B8%89%E5%B1%82%E6%B8%90%E8%BF%9B%E5%BC%8F%E5%8A%A0%E8%BD%BD%E6%9E%B6%E6%9E%84-token-%E4%BC%98%E5%8C%96

### 第一步：安装 find-skills（强烈推荐必装）

在开始使用 Skills 之前，强烈推荐先安装 `find-skills` —— 这是 AI Agent 领域的"技能搜索神器"，目前已有 60K+ 订阅量。

#### 第一个 Skill: Remotion 视频制作工具

帮我找找 Remotion 相关的技能，我想做视频

#### 第二个 Skill：用 find-skills 解决"前端又丑又卡"

我的网页看起来很土，而且加载很慢，帮我找找有什么技能可以用

Claude 会通过 find-skills 搜索 skills.sh 数据库，推荐相关的技能。对于"变好看+不卡"的需求，它会推荐：

**anthropics/skills/frontend-design**（官方技能）

这个技能专门解决 AI 生成的界面"看起来很土"的问题，让 Claude 设计出：

- 独特的视觉风格（避开千篇一律的"AI 模板感"）
- 专业的配色和字体
- 流畅的动画效果
- 生产级别的代码质量（代码干净，性能自然好）

#### 第三个 Skill：用 frontend-slides 快速制作精美 PPT

**frontend-slides** 是一个让你用自然语言创建精美 HTML 演示文稿的 Skill —— 即使你不懂任何 CSS 或 JavaScript！

### 三个 Skills 的对比

| Skills                                | 解决什么问题     | 好玩程度 | 实用程度 |
| :------------------------------------ | :--------------- | :------- | :------- |
| **remotion-dev/skills**               | 用代码做视频     | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐     |
| **anthropics/skills/frontend-design** | 让前端变好看     | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐    |
| **frontend-slides**                   | 快速制作精美 PPT | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐    |

## Claude Code

https://onevcat.com/2025/08/claude-code/