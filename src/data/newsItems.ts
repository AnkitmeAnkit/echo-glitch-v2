export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
}

export const newsCategories = [
  'All News',
  'Product Updates',
  'Industry',
  'Announcements',
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export const categoryColors: Record<string, string> = {
  'Product Update': 'bg-accent-violet text-white',
  'Industry': 'bg-accent-teal text-white',
  'Announcement': 'bg-accent-amber text-white',
  'Partnership': 'bg-accent-rose text-white',
};

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'Echo Glitch 2.0: Custom Playbook Requests Now Live',
    excerpt:
      'Starting today, teams can request custom-built playbooks tailored to their specific workflows. Our AI research team will work directly with you to document and automate your unique processes.',
    date: 'Dec 18, 2024',
    category: 'Product Update',
    content: `We're excited to announce the biggest update in Echo Glitch history — **Custom Playbook Requests** are now live for all teams.

## What Is It?

Our AI research team will work directly with your organization to:

- **Document** your existing workflows and processes
- **Identify** automation opportunities using AI
- **Build** custom playbooks tailored to your exact needs
- **Train** your team on implementation
- **Iterate** based on real-world feedback

## How It Works

**Step 1:** Submit a request through your dashboard with details about your workflow

**Step 2:** Our team schedules a 30-minute discovery call to understand your needs

**Step 3:** We deliver a custom playbook draft within 5 business days

**Step 4:** You test it, we refine it — until it's perfect

## Pricing

| Tier | Playbooks/Month | Support | Price |
|------|----------------|---------|-------|
| Starter | 1 | Email | $499/mo |
| Growth | 3 | Slack + Email | $1,499/mo |
| Enterprise | Unlimited | Dedicated PM | Custom |

## Launch Promotion

The first 50 teams to sign up get:
- ✅ First month free
- ✅ Priority support for 90 days
- ✅ Free team training session

Sign up through your dashboard or contact our team.`,
  },
  {
    id: 2,
    title: 'OpenAI Announces GPT-5 Developer Preview',
    excerpt:
      'OpenAI has opened a limited developer preview for GPT-5, featuring multi-modal reasoning, improved code generation, and a 2M token context window.',
    date: 'Dec 15, 2024',
    category: 'Industry',
    content: `OpenAI has officially announced the **GPT-5 Developer Preview**, and it's a significant leap forward for AI-powered applications.

## Key Improvements

### Multi-Modal Reasoning
GPT-5 can reason across text, images, audio, and video simultaneously. This enables:
- Analyzing video content with natural language queries
- Cross-referencing visual data with documentation
- Richer, more contextual AI assistants

### Enhanced Code Generation
- **25% fewer bugs** in generated code
- Support for 50+ programming languages
- Better understanding of large codebases (up to 2M tokens)
- Improved test generation

### Massive Context Window
The 2 million token context window means GPT-5 can:
- Process entire codebases at once
- Analyze complete books or research papers
- Maintain context across extremely long conversations

## What This Means for Echo Glitch

We're already integrating GPT-5 capabilities into our playbooks:

- **Code Playbooks:** More accurate, bug-free code generation
- **Research Playbooks:** Deeper analysis of large documents
- **Content Playbooks:** Better long-form content coherence

All existing playbooks will be updated to leverage GPT-5 over the coming weeks.

## Availability

The preview is currently limited to:
- Enterprise partners
- Selected research institutions
- Early access program members

General availability is expected in Q1 2025.`,
  },
  {
    id: 3,
    title: 'New Partnership: Echo Glitch x PhonePe Payment Integration',
    excerpt:
      'Echo Glitch is now integrated with PhonePe for seamless UPI payments on all playbook purchases. Indian customers can now pay directly using their preferred payment method.',
    date: 'Dec 12, 2024',
    category: 'Partnership',
    content: `We're thrilled to announce our partnership with **PhonePe** to bring seamless UPI payments to Echo Glitch for all Indian customers.

## What's New

Starting today, you can pay for any playbook using:

- **UPI** — Direct bank transfer via any UPI app
- **PhonePe Wallet** — Quick, one-tap payments
- **Credit/Debit Cards** — Through PhonePe's secure gateway

## Why This Matters

We heard from our Indian community that international payment methods were creating friction. This integration removes that barrier entirely.

## How to Use It

1. Browse playbooks and add to cart
2. At checkout, select "Pay with PhonePe"
3. Enter your UPI ID or scan the QR code
4. Authorize the payment in your app
5. Instant access to your playbook!

## Special Launch Offer

Use code **PHONEPE50** at checkout for 50% off your first purchase.

*Limited to first 200 customers. Valid through Dec 31, 2024.*`,
  },
  {
    id: 4,
    title: '6 New Playbooks Added to The Arsenal',
    excerpt:
      'Our latest collection includes playbooks for AI-powered design, financial modeling, legal document review, customer success, and more.',
    date: 'Dec 10, 2024',
    category: 'Product Update',
    content: `We've just dropped **6 brand new playbooks** into the Arsenal, bringing our total collection to 50+ proven execution guides.

## New Playbooks This Month

### 1. AI-Powered Design Sprint Playbook
Learn how to run complete design sprints using AI tools — from research to final prototypes in 5 days.

**Includes:**
- User research automation
- AI-assisted wireframing
- Midjourney prompt library for UI inspiration
- Usability testing scripts

### 2. Financial Modeling with AI Playbook
Build sophisticated financial models using AI-assisted formulas and scenario planning.

**Includes:**
- Revenue forecasting templates
- Sensitivity analysis automation
- Investor-ready presentation formats
- Common mistake prevention guide

### 3. Legal Document Review Playbook
Speed up contract review and legal research with AI-powered analysis workflows.

**Includes:**
- Contract clause identification
- Risk assessment frameworks
- Red flag detection prompts
- Comparison methodology

### 4. Customer Success Automation Playbook
Build a scalable customer success function using AI for onboarding, health scoring, and retention.

**Includes:**
- Onboarding sequence templates
- Churn prediction workflows
- Automated health score calculation
- Escalation playbooks

### 5. AI-Assisted Research Playbook
Conduct deep research in a fraction of the time using AI-powered literature review and synthesis.

**Includes:**
- Academic paper summarization
- Citation network analysis
- Gap identification methodology
- Research writing templates

### 6. Multi-Agent Team Setup Playbook
Configure teams of AI agents that collaborate on complex projects autonomously.

**Includes:**
- Agent architecture patterns
- Communication protocols
- Error handling strategies
- Monitoring and oversight frameworks

## Bundle Deal

Get all 6 playbooks for the price of 4 — **save 33%** with code **ARSENAL6** at checkout.

*Valid through Dec 20, 2024.*`,
  },
  {
    id: 5,
    title: 'The State of AI Automation: 2024 Year in Review',
    excerpt:
      'AI automation adoption grew 340% in 2024. We break down the key trends, tools, and predictions that shaped the industry this year.',
    date: 'Dec 5, 2024',
    category: 'Industry',
    content: `As 2024 draws to a close, we're looking back at a transformative year for AI automation. Here are the key trends and developments that defined the industry.

## By the Numbers

| Metric | 2023 | 2024 | Change |
|--------|------|------|--------|
| Companies using AI automation | 23% | 67% | +191% |
| Avg. time saved per employee/week | 2.5 hrs | 8.5 hrs | +240% |
| AI automation tools market size | $2.1B | $8.9B | +324% |
| ROI reported by adopters | 120% | 310% | +158% |

## Key Trends

### 1. From Chat to Agents
The biggest shift in 2024 was the move from simple chat interfaces to autonomous agents that can execute multi-step workflows.

### 2. Enterprise Adoption Accelerated
Fortune 500 companies moved from pilots to production deployments at an unprecedented rate.

### 3. No-Code AI Matured
Platforms like Make.com, Zapier, and Bubble added sophisticated AI capabilities, democratizing access.

### 4. Multi-Modal Workflows
The ability to process text, images, audio, and video in a single workflow opened new possibilities.

### 5. AI-Human Collaboration Models
Organizations developed new operating models that blend AI efficiency with human judgment.

## Tool of the Year

**Winner:** Claude 3
- 200K context window changed what's possible
- Superior reasoning and analysis
- Best-in-class code generation

**Runner Up:** Make.com
- Most improved AI integration
- Best no-code automation platform
- Excellent price-to-value ratio

## Looking Ahead to 2025

Our predictions for the coming year:

1. **Autonomous agents go mainstream** — Self-directed AI workers become common
2. **Voice becomes primary interface** — More automation triggered by voice
3. **AI stack consolidation** — Platform players acquire point solutions
4. **Regulation shapes development** — EU AI Act and US policies impact tooling
5. **Personal AI assistants** — Everyone has a custom AI that knows their workflow

## Echo Glitch in 2024

This year, we:
- Launched 50+ playbooks
- Grew to 25,000+ active users
- Processed 1M+ automation runs
- Expanded to 15 countries
- Achieved $2M ARR

Thank you for being part of this journey. 2025 is going to be incredible.`,
  },
  {
    id: 6,
    title: 'Welcome to Echo Glitch: Our Launch Story',
    excerpt:
      'How two frustrated product builders went from a shared Notion doc to a platform serving 25,000+ users in under a year.',
    date: 'Dec 1, 2024',
    category: 'Announcement',
    content: `Today marks the official public launch of **Echo Glitch** — and we couldn't be more excited to share our story with you.

## The Origin Story

Echo Glitch started as a simple frustration.

In early 2024, we (Alex and Jordan, co-founders) were building AI-powered tools at a startup. We kept hitting the same wall:

> We knew AI could do amazing things, but getting consistent, reliable results felt like black magic.

Every "AI tutorial" taught us isolated tricks. Every "best practices" article was already outdated. We spent more time figuring out how to use AI than actually using it.

So we started documenting what worked.

## From Notion to Platform

**February 2024:** A shared Notion doc called "AI Recipes" with 10 prompts that actually worked

**March 2024:** Shared it with friends. They loved it. Added 20 more recipes.

**April 2024:** 500 people subscribed to our newsletter. Realized we were onto something.

**May 2024:** Built a simple website. Called it "Echo Glitch" — the echo of what works, the glitch that breaks through.

**June–August 2024:** Quietly built the platform. Tested with beta users. Iterated based on feedback.

**September 2024:** 5,000 users. First revenue. Validation.

**October–November 2024:** Grew the team. Built more playbooks. Improved the platform.

**December 2024:** 25,000 users. Public launch. You are here.

## What We Believe

**AI is a multiplier, not a replacement.**

The best results come from humans who know how to wield AI effectively. Our mission is to make that knowledge accessible, actionable, and constantly evolving.

**Execution beats theory.**

Every playbook is designed for one thing: getting results. No fluff, no filler, no "it depends." Just proven steps that work.

**Community creates better playbooks.**

Our playbooks get better because our users share what worked, what didn't, and what they discovered. This is a collaborative knowledge base.

## What's Next

- **Q1 2025:** Custom playbook requests, team collaboration features
- **Q2 2025:** Mobile app, offline access
- **Q3 2025:** AI-powered playbook recommendations
- **Q4 2025:** Marketplace for community-created playbooks

## Join Us

Whether you're AI-curious or an automation veteran, there's a place for you here.

Browse the Arsenal. Pick a playbook. Start executing.

Welcome to Echo Glitch.

— Alex & Jordan, Co-founders`,
  },
  {
    id: 7,
    title: 'Echo Glitch Mobile App Enters Beta',
    excerpt:
      'Access your playbooks on the go with our new iOS and Android apps. Features offline reading, progress tracking, and push notifications.',
    date: 'Nov 28, 2024',
    category: 'Product Update',
    content: `The **Echo Glitch Mobile App** is now in public beta for iOS and Android!

## Features

### Offline Reading
Download playbooks for offline access. Perfect for commutes, flights, or anywhere without reliable internet.

### Progress Tracking
Track your progress through each playbook. Pick up exactly where you left off, across all devices.

### Push Notifications
Get notified when:
- New playbooks are released
- Your followed playbooks are updated
- Community members reply to your comments

### Mobile-Optimized Layout
Playbooks are reformatted for mobile reading with:
- Collapsible sections
- Swipe navigation
- Quick-action buttons
- Dark mode support

## How to Join the Beta

**iOS:** Join via TestFlight — [link in your dashboard]
**Android:** Download the APK from your dashboard

## Known Issues

As a beta release, you may encounter:
- Occasional sync delays between devices
- Some formatting issues on smaller screens
- Battery optimization on older devices

Please report any issues through the in-app feedback button.

## Public Release Timeline

We expect to launch publicly in **February 2025**, pending beta feedback.`,
  },
  {
    id: 8,
    title: 'Anthropic Releases Claude 3.5 with Revolutionary Code Capabilities',
    excerpt:
      'Claude 3.5 Sonnet introduces Artifacts — a new way to generate, edit, and preview code, websites, and documents in real-time within the chat interface.',
    date: 'Nov 25, 2024',
    category: 'Industry',
    content: `Anthropic has dropped a game-changer: **Claude 3.5 Sonnet** with a revolutionary feature called **Artifacts**.

## What Are Artifacts?

Artifacts allow Claude to generate content in a dedicated window alongside your conversation. This means:

- **See code render in real-time** — As Claude writes HTML, React, or SVG, you see the result immediately
- **Iterate visually** — Ask for changes and see them applied instantly
- **Edit directly** — Modify artifacts yourself and ask Claude to refine
- **Export easily** — Download or copy your finished artifact

## Code Capabilities

Claude 3.5 shows dramatic improvements:

| Task | Claude 3 | Claude 3.5 | Improvement |
|------|----------|-----------|-------------|
| Bug detection | 78% | 94% | +21% |
| Code generation | 82% | 96% | +17% |
| Refactoring | 71% | 92% | +30% |
| Documentation | 85% | 98% | +15% |

## What This Means for Developers

- **Prototyping speed:** Go from idea to working prototype in minutes
- **Learning:** See how code works by watching it render
- **Debugging:** Visual feedback makes errors obvious
- **Collaboration:** Share artifacts with team members

## Echo Glitch Integration

We're updating our coding playbooks to leverage Artifacts:
- Interactive code generation tutorials
- Visual debugging guides
- Real-time project building walkthroughs

All coding playbooks will be updated by end of December.`,
  },
  {
    id: 9,
    title: 'Community Spotlight: 10,000 Playbooks Completed in One Month',
    excerpt:
      'Our community achieved a major milestone. We highlight the top contributors, most-used playbooks, and success stories from the past month.',
    date: 'Nov 22, 2024',
    category: 'Announcement',
    content: `Our community just hit a massive milestone: **10,000 playbooks completed in a single month**!

## By the Numbers

- **10,247** playbooks completed
- **4,521** active community members
- **892** success stories shared
- **156** playbook improvements suggested
- **47** new community-created templates

## Most-Used Playbooks This Month

| Rank | Playbook | Completions |
|------|----------|-------------|
| 1 | ChatGPT Prompt Engineering | 1,847 |
| 2 | Content Creation Automation | 1,234 |
| 3 | Market Research with AI | 987 |
| 4 | Customer Support Automation | 856 |
| 5 | Social Media Management | 743 |

## Community Success Stories

**"From Side Hustle to Full Income"**
> "Using the Content Creation and Sales Outreach playbooks, I landed 5 retainer clients in 3 weeks. I'm now working full-time on my own business." — Maria G.

**"Saved 15 Hours Per Week"**
> "The Automation Playbook helped me automate 80% of my reporting tasks. I got promoted because I could focus on strategic work instead." — James T.

**"First Product Launch"**
> "I used the Product Launch Playbook to ship my first SaaS product. Made $5K in the first week. The playbook paid for itself 100x over." — Aisha K.

## Top Contributors

Special thanks to our top community contributors this month:

- **@promptwizard** — 23 prompt improvements submitted
- **@automatelife** — 12 new workflow templates
- **@airesearcher** — 8 research methodology contributions
- **@nocodemaster** — 15 no-code integration guides

## Join the Community

- **Discord:** 5,000+ members sharing daily
- **Weekly AMAs:** Every Thursday at 3 PM ET
- **Contributor Program:** Get paid for playbook improvements

Thank you for making Echo Glitch what it is. Here's to the next 10,000!`,
  },
  {
    id: 10,
    title: 'Echo Glitch Teams: Collaborative Playbook Workspaces',
    excerpt:
      'Introducing shared workspaces where teams can collaborate on playbooks, track collective progress, and build internal knowledge bases together.',
    date: 'Nov 20, 2024',
    category: 'Product Update',
    content: `Today we're launching **Echo Glitch Teams** — collaborative workspaces designed for organizations that want to build and execute playbooks together.

## What's Included

### Shared Playbook Library
- Central repository for all team playbooks
- Version history and change tracking
- Role-based access controls
- Custom playbook categories

### Team Progress Tracking
- See who's working on what
- Track completion across the team
- Identify bottlenecks
- Celebrate wins together

### Internal Knowledge Base
- Create private playbooks for internal processes
- Template library for your organization
- Best practices documentation
- Onboarding sequences

### Collaboration Features
- **Comments and discussions** on each playbook step
- **Assignments** — delegate specific steps to team members
- **Due dates** and reminders
- **Approval workflows** for quality control

## Pricing

| Plan | Members | Private Playbooks | Price |
|------|---------|-------------------|-------|
| Starter | Up to 5 | 10 | $49/mo |
| Growth | Up to 20 | 50 | $149/mo |
| Enterprise | Unlimited | Unlimited | Custom |

All plans include:
- Access to the full public playbook library
- Team analytics dashboard
- Priority support
- API access

## Customer Spotlight

**How Lumen Analytics Uses Teams:**

> "We have 12 people across 3 time zones. Echo Glitch Teams keeps everyone aligned. Our onboarding playbook reduced new hire ramp time from 4 weeks to 1 week." — CEO, Lumen Analytics

## Getting Started

1. Go to your dashboard
2. Click "Create Team"
3. Invite team members
4. Start collaborating!

*Existing subscribers can add Teams to their plan at any time.*`,
  },
];
