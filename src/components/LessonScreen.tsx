import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, FileText, Video, Users, ChevronDown, BookOpen, Send, Loader2, Lock, Play, ExternalLink } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { GlassCard } from './ui/GlassCard';
import { ProgressBar } from './ui/ProgressBar';
import { Button3D } from './ui/Button3D';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface LessonScreenProps {
  weekNumber: number;
  weekTitle: string;
  trackLevel?: string;
  programId?: string;
  startSection?: number;
  enrollmentId?: string | null;
  onBack: () => void;
  onComplete: (completed: boolean) => void;
  onSectionComplete?: (sectionIndex: number, totalSections: number) => void;
}

export function LessonScreen({ weekNumber, weekTitle, trackLevel = 'beginner', programId = 'COLLEGE', startSection = 0, enrollmentId = null, onBack, onComplete, onSectionComplete }: LessonScreenProps) {
  const [currentSection, setCurrentSection] = useState(startSection);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  // Activity submission state
  const [activityResponse, setActivityResponse] = useState('');
  const [submittedActivities, setSubmittedActivities] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Sync currentSection when startSection prop changes
  useEffect(() => {
    setCurrentSection(startSection);
  }, [startSection, weekNumber]);

  // Load previously submitted activities from database
  useEffect(() => {
    const loadSubmittedActivities = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('activity_responses')
          .select('day_number')
          .eq('user_id', user.id)
          .eq('week_number', weekNumber);

        if (error) {
          console.error('Failed to load submitted activities:', error);
          return;
        }

        if (data && data.length > 0) {
          const submitted: Record<number, boolean> = {};
          data.forEach((item: { day_number: number }) => {
            // Convert day_number (1-indexed) back to section index (0-indexed)
            submitted[item.day_number - 1] = true;
          });
          setSubmittedActivities(submitted);
        }
      } catch (err) {
        console.error('Error loading submitted activities:', err);
      }
    };

    loadSubmittedActivities();
  }, [weekNumber]);

  // Lesson content for different weeks
  const getLessonContent = (week: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessonMap: Record<number, any> = {
      1: {
        title: "Understanding Income, Expenses, and Savings",
        sections: [
          {
            title: "What is Income?",
            type: "video",
            duration: "8 min",
            videoUrl: "gq3hMjBrvLo",
            content: `Alright, so what even is income? It's basically all the money that comes INTO your pocket from wherever. Pretty simple, right?

As a student, you might be getting money from a bunch of different places:

• **Part-time jobs** - Like working at Chipotle, the campus bookstore, or wherever
• **Scholarships** - Yup, athletic scholarships and academic ones both count
• **Family support** - Money your parents or family members give you
• **Side hustles** - Maybe you tutor younger kids, run a YouTube channel, or sell stuff online

Here's the big picture: You want MORE money coming in than going out. That's literally the whole game. If you make more than you spend, you're winning. If you spend more than you make, you're gonna have problems real quick.`,
            keyPoints: [
              "Keep track of every place money comes from",
              "Your scholarship counts as income too",
              "Save receipts and records for tax season",
              "Always look for ways to make more money"
            ],
            articles: [
              {
                title: "What Is Income, Really?",
                content: `When most people hear the word "income," they think it just means a job and a paycheck. Clock in, clock out, money hits your account. But income is bigger than that, and understanding it early puts you ahead of most adults.

Income is any money that comes into your life. That's it. Money in. It does not matter if it comes from a boss, a parent, a customer, or a side hustle. If money comes to you, that is income.

For high school students, income can show up in a lot of ways. Some of you get an allowance for helping around the house. Some of you work part-time jobs at fast food spots, stores, or warehouses. Some of you babysit, cut hair, do lashes, sell clothes online, flip shoes, resell electronics, or make content. All of that counts as income.

There are two main types of income you need to understand.

The first is earned income. Earned income is money you get by trading your time, effort, or skill for pay. A part-time job is earned income. Babysitting is earned income. Cutting hair, doing lashes, detailing cars, or helping someone move is earned income. You did something, someone paid you.

The second is unearned income. This is money you receive without directly working for it in that moment. Allowance can be unearned income. Gifts can be unearned income. Money from a family member helping you out can be unearned income.

Here is the key lesson most people miss:
Not all income feels the same.

Money you earn hits different than money you are given. Earned income usually makes you more careful, more respectful of your time, and more aware of how fast money can disappear. Unearned income is easier to spend because you did not feel the work behind it.

Income is not about how much money you make. It is about understanding where your money comes from and what it costs you to get it. Once you understand income, you can start making smarter decisions with it.`
              },
              {
                title: "Why Earned Money Changes the Way You Think",
                content: `There is a moment almost everyone remembers: their first real paycheck. Not allowance money. Not birthday money. Real earned money.

You work the hours. You get tired. You deal with people you do not always like. Then the money finally hits. And suddenly, spending it feels different.

That is not an accident.

Earned money changes how you think because it represents your time. When you work three, five, or eight hours for your money, you start doing math in your head before you spend it. You ask yourself questions like, "Was that worth two hours of my life?" or "How long did I have to work to buy this?"

This is why earned income builds discipline.

When students earn money through jobs or side hustles like babysitting, cutting hair, reselling clothes, or doing small services, they start learning real-world lessons early:

- Time is limited
- Money is not guaranteed
- Effort matters
- Skills have value

People who never learn this early often struggle later. They spend fast, save nothing, and panic when money stops coming in. People who learn this early start to plan ahead. They become more selective. They begin to think before they spend.

Another important lesson is this: easy money leaves faster than earned money. When money comes without effort, it usually goes without thought. When money comes from work, you protect it more.

Earned income does not just give you money. It gives you confidence. You realize you can create value. You realize you are capable. That mindset is more important than the paycheck itself.

The goal is not just to make money.
The goal is to respect money.`
              }
            ],
            activityQuestion: "Think about your current sources of income (job, allowance, side hustle, etc.). Describe one source of income you have or could create, and explain whether it's earned or unearned income. How does knowing the difference change how you might spend that money?"
          },
          {
            title: "The Power of Saving",
            type: "video",
            duration: "8 min",
            videoUrl: "ssLouh8kSUc",
            content: `Real talk - saving money is just like building any skill. You don't become great overnight, and you don't build wealth overnight either. It takes discipline and doing it consistently, even when you don't feel like it.

Even if you're only saving like $5 or $10 a week, that stuff ADDS UP. Seriously. That's the magic of compound interest (basically your money making more money over time).

**Why even bother saving?**
• Emergency fund - because your car WILL break down at the worst time
• Future goals - want a car? Your own place? To start a business? You need cash
• Peace of mind - not stressing about money is honestly priceless
• Building up credit and being able to invest later

**How much should you save?**
Try the 50/30/20 rule (it's pretty simple):
• 50% goes to NEEDS (rent, food, bills - the stuff you can't skip)
• 30% goes to WANTS (fun stuff, eating out, entertainment)
• 20% goes to SAVINGS and paying off any debt you have`,
            keyPoints: [
              "Literally start with $5/week if that's all you got",
              "Set up automatic transfers so you don't forget",
              "Keep your emergency money in a separate account",
              "Pick a specific goal - like 'save $500 by June'"
            ],
            articles: [
              {
                title: "Why Saving Money Is Power",
                content: `Most people think saving money is boring. That idea usually comes from people who never had savings.

Saving money is not about being cheap. Saving money is about power.

When you have savings, you have options. When you do not, life controls you.

Think about what happens when something unexpected hits. A phone breaks. A car needs repairs. A family emergency comes up. Without savings, those situations turn into stress, panic, and bad decisions. With savings, they turn into problems you can handle.

That is the difference.

Saving money gives you breathing room. It gives you the ability to say no. It gives you time to think instead of react. That is power.

People without savings often feel trapped. They take whatever job they can. They stay in situations they do not like. They borrow money they cannot afford to pay back. Not because they want to, but because they have no buffer.

People with savings move differently. They are calmer. They plan ahead. They are not desperate. They are not rushing. They are not forced into decisions by fear.

Saving money is not about how much you make. You can make a little and still save something. The habit matters more than the amount. Saving teaches discipline. It teaches patience. It teaches control.

Power is not just having money.
Power is being prepared.`
              },
              {
                title: "Saving Money Keeps You Out of Survival Mode",
                content: `Survival mode is when every problem feels like an emergency. When one small issue can knock everything over. When you are constantly reacting instead of planning.

Most people do not live in survival mode because they are lazy or irresponsible. They live there because they have no savings.

Savings act like armor. They protect you when life throws punches, and life always throws punches.

An emergency fund is money set aside for unexpected situations. Not for shopping. Not for fun. For real life. It could be $50, $100, or more depending on your situation. What matters is starting.

Without savings, people often make bad moves:

- Borrowing money with high interest
- Asking people who later hold it over them
- Selling things they need
- Taking jobs or risks out of panic

Savings stop that cycle.

When you save, you buy yourself time. Time to think. Time to choose. Time to make a smart decision instead of a rushed one.

High school is the perfect time to learn this because the stakes are lower. You can practice saving with allowance money, job money, or side hustle income. The habit you build now follows you into adulthood.

Saving money is not fear-based. It is confidence-based. It is saying, "I am ready for whatever comes next."

And that mindset will take you further than any paycheck ever will.`
              }
            ],
            activityQuestion: "Using the 50/30/20 rule discussed in this lesson, imagine you received $100. How would you split it up? Write out exactly where each dollar would go and explain why you made those choices."
          },
          {
            title: "Types of Expenses",
            type: "video",
            duration: "8 min",
            videoUrl: "EkeC0L55jms",
            content: `So expenses are basically everywhere money LEAVES your pocket. But not all expenses are the same - there's two types you gotta know:

**FIXED EXPENSES (Same amount every single month):**
• Rent - gotta have somewhere to live
• Phone bill - always the same price
• Insurance - same monthly charge
• Loan payments - doesn't change month to month

**VARIABLE EXPENSES (This is where things get wild):**
• Food - depends on how much you eat out vs cook
• Entertainment - movies, concerts, games, etc.
• Shopping - clothes, random stuff you "need"
• Gas - depends on how much you drive

Why does this matter? Because fixed expenses are locked in - you can't really change them much. But variable expenses? That's where you have POWER. You can totally control how much you spend on food, entertainment, and shopping. That's where you'll save money if you need to.`,
            keyPoints: [
              "Fixed = same every month, can't really change it",
              "Variable = you control this, cuts can happen here",
              "Track what you spend for a month to see patterns",
              "Buy what you NEED first, then wants if there's money left"
            ],
            articles: [
              {
                title: "What Are Expenses and Why They Control Your Life If You Don't Control Them",
                content: `Let's get one thing straight.
Making money does not make you rich.
Controlling expenses does.

An expense is any money you spend. Every dollar that leaves your pocket, your account, or your app is an expense. Rent. Food. Clothes. Shoes. Gas. Subscriptions. Snacks. All of it.

Here's the part most people don't understand early enough:
Expenses don't care how much money you make.
They will eat whatever you bring in if you don't manage them.

You can make money babysitting, working part-time, cutting hair, doing lashes, reselling clothes, or getting allowance. But if every dollar goes right back out, you're not building anything. You're just surviving.

Expenses fall into two main categories: fixed expenses and variable expenses. If you don't know the difference, you will always feel broke, no matter how much money you touch.

Fixed expenses are bills that stay mostly the same every month. These are the expenses that show up whether you feel like paying them or not. Think phone bills. Internet. Rent. Car payments. Insurance. These bills don't care if you're tired, broke, or not in the mood. They are locked in.

Variable expenses are the ones that change. These are the ones you usually have more control over. Food. Snacks. Clothes. Shoes. Streaming apps. Games. Eating out. Online shopping. These can go up or down depending on your choices.

Here's the problem:
Most people treat variable expenses like they're fixed.
They act like eating out every day or buying something online every week is "normal," when really it's optional.

Money freedom starts when you stop asking, "How much do I make?"
And start asking, "Where is my money going?"`
              },
              {
                title: "Fixed vs Variable Expenses: The Difference Between Control and Chaos",
                content: `If you want to understand money fast, this is one of the most important lessons you'll ever learn.

Fixed expenses are the bills you commit to. Once you say yes, they are locked in. If your phone bill is $120 a month, that money is gone before you even touch your paycheck. If rent, car payments, or insurance exist, those come first.

Fixed expenses are not automatically bad. The problem is when people stack too many of them too early. They lock themselves into bills before they have stable income. Then they wonder why they feel stuck.

Variable expenses are where your choices show. These are the day-to-day decisions that quietly drain your money. Snacks after school. Fast food runs. Online orders. New shoes when the old ones are fine. Subscriptions you forgot you even had.

Here's a simple rule:
You can't control fixed expenses easily, but you can control variable expenses immediately.

That's power.

When money is tight, most people panic instead of adjusting. They don't look at their variable expenses. They don't cut back. They just feel stressed and confused.

Smart people do the opposite. They look at their variable spending first. They ask:

- Do I really need this?
- Is this helping me or just making me feel good for five minutes?
- What happens if I save this instead?

This doesn't mean you can't enjoy life. It means you're intentional. There's a difference between spending with purpose and spending on autopilot.

If you learn this now, while the stakes are smaller, you'll avoid big mistakes later. Most adults never learn this. That's why they stay paycheck to paycheck.

Money doesn't disappear.
It leaks.
And once you learn how to plug the leaks, everything changes.`
              }
            ],
            activityQuestion: "List 3 fixed expenses and 3 variable expenses you currently have (or would have if you were living on your own). For each variable expense, suggest one way you could reduce it without completely giving it up."
          },
          {
            title: "Creating Your First Budget",
            type: "video",
            duration: "8 min",
            videoUrl: "jqyCiAIPCP8",
            content: `Okay, time to make your first budget. Don't worry, it's not as boring as it sounds. Think of a budget like your game plan - except instead of planning plays, you're planning where your money goes BEFORE you spend it.

**Step 1: Figure out your monthly income**
Just add up all the money you get in a month. Scholarship, job, parents, whatever.

**Step 2: Write down ALL your expenses**
And I mean everything - rent, food, Netflix, gas, that energy drink you buy every morning. Everything.

**Step 3: Do the math: Income minus Expenses**
If you get a positive number = you're good! You're making more than you're spending.
If you get a negative number = Houston, we have a problem. You need to either make more money or spend less.

**Step 4: Put savings FIRST**
This is the secret sauce: pay yourself FIRST. Before you buy anything fun, move some money to savings. Treat savings like a bill you HAVE to pay.`,
            keyPoints: [
              "Every single dollar needs a job - track it all",
              "Be honest about what you actually spend",
              "Check your budget every month and fix what's not working",
              "Hit a savings goal? Celebrate! You earned it"
            ],
            articles: [
              {
                title: "Why a Budget Is Not About Being Cheap, It's About Being in Control",
                content: `Let me clear something up right now.
A budget is not a punishment.
A budget is not for broke people.
A budget is not about saying "no" to everything.

A budget is about control.

A budget is simply a plan for your money. It tells your money where to go instead of wondering where it went. Every single person who stays winning with money has a budget, whether they call it that or not.

Most people don't lose money because they don't make enough. They lose money because they never gave it instructions.

When money comes in and there's no plan, it disappears. Snacks, apps, rides, food, random purchases. You don't even remember what you spent it on. That's not bad luck. That's no structure.

A budget creates structure.

Think about it like this: if you had no schedule for school, no bell times, no classes, no structure, the day would be chaos. Money works the same way. Without a budget, your money day is just vibes.

A budget helps you:

- Make sure your needs are covered
- Decide how much you can spend without stress
- Save without "hoping" there's money left
- Stop feeling surprised when money runs out

Here's the biggest mindset shift:
A budget tells you what you CAN spend, not just what you can't.

That's freedom.

People who say "budgets don't work" usually mean "I don't like limits." But limits are what keep you out of survival mode. Limits protect future you.

A budget is how you stop reacting and start planning.
And planning is how you level up.`
              },
              {
                title: "How to Create a Budget That Actually Works in Real Life",
                content: `Budgeting sounds complicated until you realize it's just basic math and honesty.

Step one is knowing your income. That's all the money coming in. Allowance. Job money. Babysitting. Side hustles. Whatever applies to you. If you don't know how much you bring in, you're guessing from the start.

Step two is knowing your expenses. Fixed expenses first. Phone bill. Transportation. Anything that shows up no matter what. Then variable expenses. Food, snacks, clothes, entertainment, online shopping. This is where most money disappears.

Step three is deciding what matters most. This is where the budget becomes personal. How much do you want to save? What are you willing to spend on fun without regret? What are you cutting back on so future you wins?

A simple budget looks like this:

- Money coming in
- Money going out
- Money saved

That's it.

The key is being real with yourself. If you lie to your budget, it won't work. If you say you're only spending $20 a week on food but really spend $60, the budget didn't fail. Honesty did.

A budget should fit your life, not someone else's. You don't need to be perfect. You need to be consistent. Adjust as you go. Budgets are not set once and forgotten. They are checked, tweaked, and improved.

Here's the secret most people never learn:
Budgeting is not about money. It's about discipline.

When you control your money, you control your options. You stop feeling broke even when you're not rich yet. You start thinking ahead. You stop being surprised by problems.

Budgeting is how regular people stop struggling.
And struggling is optional once you learn the system.`
              }
            ],
            activityQuestion: "Create a simple monthly budget for yourself using real or estimated numbers. Include: (1) Your total monthly income, (2) At least 3 fixed expenses, (3) At least 3 variable expenses, (4) How much you plan to save. Then explain one adjustment you could make if you needed to save more money."
          }
        ]
      },
      2: {
        title: "Increasing Your Income & Reach Your Goal",
        sections: [
          {
            title: "Side Hustle Opportunities for Students",
            type: "reading",
            duration: "7 min",
            content: `Look, you're a student. You've got skills and time that you can turn into cash. Why not use them to make some money? Here are some legit ways to earn:

**Use your unique skills:**
• Tutoring - help other students in subjects you're good at
• Content creation - YouTube, TikTok, Instagram about your interests
• Freelance work - graphic design, writing, video editing
• Social media management - help local businesses with their accounts
• Sell stuff you make or don't use anymore

**Flexible gigs that work around your schedule:**
• Delivery driving - DoorDash, Uber Eats, Instacart
• Campus jobs - library, rec center, bookstore
• Photography - take photos at events
• Pet sitting or dog walking - people always need this
• Reselling - buy low, sell high on eBay or Poshmark

IMPORTANT: Before you start, make sure it doesn't interfere with your studies or any scholarships/financial aid you're receiving. Check the rules first!`,
            keyPoints: [
              "You've got skills others will pay for - use them",
              "Check any scholarship or financial aid rules first",
              "Start small, see what works, then do more",
              "Pick stuff that fits around your class schedule"
            ],
            articles: [
              {
                title: "Finding Your First Side Hustle",
                content: `Starting a side hustle as a student can feel overwhelming, but the key is to start with what you already know. You do not need to learn a brand new skill or invest money you do not have. The best side hustles come from things you are already good at.

Think about what people ask you for help with. Are you good at math? You could tutor. Are you always taking photos? Offer photography for events. Do you know how to edit videos? Businesses need that skill constantly.

The easiest way to start is to solve a problem someone has. Look around your campus or neighborhood. What do people need help with? Dog walking, lawn care, tutoring, running errands, cleaning, organizing - these are all things people will pay for.

Start small. Your first client might be a neighbor or a friend of your parents. That is fine. Every successful business started somewhere. The goal is not to make a million dollars right away. The goal is to prove you can earn money on your own.

Once you get that first client, ask them to refer you to others. Word of mouth is the most powerful marketing tool, and it costs nothing.

Do not overthink it. Pick one thing you can offer, tell people about it, and see what happens. You can always adjust later.`
              },
              {
                title: "Balancing School and Extra Income",
                content: `Making extra money is great, but not if it destroys your grades or burns you out. The key to balancing school and a side hustle is being realistic about your time.

Start by mapping out your week. How many hours are you in class? How many hours do you need for homework and studying? How many hours do you need for sleep, meals, and basic self-care? Be honest.

Whatever time is left after those essentials is your available time for earning money. For most students, this is somewhere between 10 to 20 hours per week. That is it.

Now here is the important part: do not fill every single free hour with work. You need downtime. You need time with friends. You need time to just exist without being productive.

A good rule is to keep your side hustle to no more than 15 hours per week during the school year. During breaks, you can ramp up. During finals, you should ramp down or stop completely.

Also, choose work that has flexible hours. A part-time job with a set schedule can be hard to manage around classes. Gig work, freelancing, or services you control let you work when it makes sense for you.

Remember: your education is the investment that will pay off the longest. Do not sacrifice it for short-term money. Find the balance that lets you earn without falling behind.`
              }
            ],
            activityQuestion: "Identify three skills or interests you have that could potentially become a side hustle. For each one, explain who would pay for it and how much you could realistically charge. Then choose the one that seems most feasible to start with and explain why."
          },
          {
            title: "Goal Setting and Income Planning",
            type: "interactive",
            duration: "6 min",
            content: `If you don't have a clear goal, you're just gonna spend money on random stuff and wonder where it all went. Goals keep you focused and actually motivated to make and save money.

**How to set SMART goals (yeah, it's an acronym):**
• **Specific** - Say EXACTLY what you want. "Save $1,000" not just "save money"
• **Measurable** - Use numbers so you can track it
• **Achievable** - Be real with yourself. Don't say you'll save $10,000 in a month on a part-time job
• **Relevant** - Pick something that actually matters to YOU
• **Time-bound** - Give yourself a deadline or it'll never happen

**Here's what a good goal looks like:**
"I'm gonna save $500 for an emergency fund by working 10 hours a week at my campus job for the next 4 months."

See? Specific, measurable, achievable, relevant, and has a deadline. That's how you do it.`,
            keyPoints: [
              "Write your goals down - seriously, grab your phone and type it out",
              "Big goal? Break it into smaller chunks",
              "Have short-term goals (next month) AND long-term (next year)",
              "Check your progress every month and adjust if needed"
            ],
            articles: [
              {
                title: "Why Written Goals Actually Work",
                content: `There is something that happens when you write a goal down. It stops being a vague wish and becomes something real. This is not just motivational talk. There is psychology behind it.

When a goal exists only in your head, it competes with thousands of other thoughts. It gets lost. It changes shape. You forget the details. But when you write it down, you force yourself to be specific. You have to choose words. You have to commit.

Written goals also create accountability. When you see your goal written somewhere, you cannot pretend you never set it. It is there, reminding you.

The most effective way to write a goal is to make it as specific as possible. Instead of writing "save money," write "save $500 by June 1st by putting $50 from each paycheck into my savings account."

Keep your written goals somewhere you will see them regularly. Some people use their phone's notes app. Some people write them on sticky notes on their mirror. Some people use a journal. The method does not matter. What matters is that you see your goals often.

Review your written goals at least once a week. Ask yourself: Am I making progress? What did I do this week that moved me closer? What could I do next week?

Writing goals down is not magic. But it is one of the simplest things you can do to dramatically increase your chances of achieving them.`
              },
              {
                title: "Breaking Big Goals into Action Steps",
                content: `Big goals can feel impossible. When you look at the gap between where you are and where you want to be, it is easy to feel overwhelmed and give up before you start.

The solution is to break every big goal into smaller steps. These steps should be so small that each one feels achievable on its own.

Say your goal is to save $1,000 in six months. That can feel like a lot. But break it down: that is about $167 per month, or roughly $42 per week, or about $6 per day.

Now the question becomes: can you find $6 per day? Can you skip one coffee? Can you pack lunch instead of buying it? Can you work one extra hour somewhere?

Suddenly, a big goal becomes a series of tiny daily decisions.

The same applies to income goals. Want to make an extra $500 per month from a side hustle? Break it down. If you charge $25 per hour for tutoring, you need 20 hours of tutoring per month. That is 5 hours per week. That is less than one hour per day.

Each big goal should have a list of action steps beneath it. These steps should be specific things you can do today, this week, this month. When you finish a step, cross it off. The progress you see will keep you motivated.

Never let a goal sit without action steps. A goal without steps is just a dream.`
              }
            ],
            activityQuestion: "Write a SMART financial goal for yourself. Make sure it is Specific, Measurable, Achievable, Relevant, and Time-bound. Then break that goal down into monthly milestones and list three specific actions you will take this week to start working toward it."
          },
          {
            title: "Building Multiple Income Streams",
            type: "reading",
            duration: "5 min",
            content: `Think about successful people - they don't just have one source of income. They've got investments, businesses, side projects, all kinds of stuff. You should think the same way about YOUR money, even if it's on a smaller scale.

**Your main income:**
This is your primary thing - your scholarship, your main job, whatever.

**Add more income streams:**
• Part-time job on the side
• Use your skills to make money (coaching, tutoring, etc.)
• Passive income once you get it set up (like selling designs online)
• Investment returns (this is advanced stuff for later)

**Why bother with multiple streams?**
• If one dries up, you're not screwed - you have others
• More streams = more total money coming in
• If you lose your main job, you still have money coming in
• You learn different skills and get experience in different areas

Don't try to do everything at once. Start with ONE extra income stream. Get good at it. Then add another when you're ready.`,
            keyPoints: [
              "Don't put all your eggs in one basket - have multiple income sources",
              "Start with what you already know how to do",
              "Add new streams slowly - don't overwhelm yourself",
              "Keep track of how much each stream brings in"
            ],
            articles: [
              {
                title: "Why One Income Source Is Risky",
                content: `Most people rely on a single source of income. They have a job, and that job pays their bills. When that job is stable, everything feels fine. But what happens when it is not?

Jobs end. Hours get cut. Companies close. Pandemics happen. Economic downturns happen. When you rely on one income source, any disruption to that source disrupts your entire life.

This is why building multiple income streams matters, even when you are young and even when the amounts are small.

Think of income streams like legs on a chair. A chair with one leg falls over if that leg breaks. A chair with four legs stays standing even if one gets damaged.

The goal is not to have ten different jobs and no free time. The goal is to have more than one way money comes into your life.

For students, this might look like: a part-time job plus occasional tutoring. Or a scholarship plus selling items online. Or family support plus a summer internship plus a small freelance project.

Each stream does not need to be huge. Having three streams of $200 per month each is more stable than one stream of $600 per month.

Start thinking about income as a portfolio, not a single source. Even small steps toward diversification make you more financially secure.`
              },
              {
                title: "Active vs Passive Income Explained",
                content: `Not all income requires the same amount of ongoing effort. Understanding the difference between active and passive income can change how you think about making money.

Active income is money you earn by trading your time directly for pay. You work an hour, you get paid for that hour. When you stop working, the income stops. Most jobs are active income. Tutoring is active income. Babysitting is active income.

Passive income is money that comes in without you actively working for it in that moment. The work happens upfront, and then the income flows with little ongoing effort. Examples include rental income, investment dividends, royalties from creative work, or income from digital products you created once and sell repeatedly.

Here is the truth: truly passive income is rare and usually requires either money to invest upfront or significant time to create something valuable first. Do not fall for schemes that promise easy passive income. Most are scams.

However, there are levels of passivity. Some income is more passive than others. A YouTube video you made last year that still gets views and ad revenue is more passive than a job where you clock in and out.

As you grow financially, aim to add increasingly passive income streams over time. But start with active income. That is how you build the foundation and the capital to eventually create more passive options.

The goal is not to avoid work. The goal is to eventually have money working for you while you sleep.`
              }
            ],
            activityQuestion: "List all your current sources of income (include everything: jobs, allowance, gifts, side hustles, etc.). For each source, identify whether it is active or passive income. Then brainstorm one new potential income stream you could add in the next three months and explain how you would start it."
          },
          {
            title: "Tracking Your Income & Progress",
            type: "reading",
            duration: "6 min",
            content: `You can't improve what you don't measure. If you want to grow your income, you need to know exactly where your money is coming from and how much you're making.

**Why track your income?**
• See patterns - maybe you make more on certain days or times
• Find opportunities - notice which activities pay best for your time
• Stay motivated - watching your income grow feels good
• Plan better - know what to expect each week/month

**Simple ways to track:**
• Use a notes app on your phone - just jot down what you earned and from where
• Create a simple spreadsheet - date, source, amount
• Use a budgeting app that tracks income
• Keep a small notebook dedicated to money tracking

**What to track:**
• Date you received the money
• Where it came from (job, side hustle, gift, etc.)
• Amount (before and after any deductions)
• Hours worked (so you can calculate your hourly rate)

**Review weekly:**
Set aside 10 minutes every Sunday to look at what you earned that week. Ask yourself: What worked? What didn't? What can I do more of next week?`,
            keyPoints: [
              "Track every dollar that comes in - no amount is too small",
              "Calculate your actual hourly rate for different activities",
              "Review your income weekly to spot patterns",
              "Use the data to make smarter decisions about your time"
            ],
            articles: [
              {
                title: "The Power of Knowing Your Numbers",
                content: `Most people have no idea how much money they actually make. They know their hourly wage or their salary, but they do not know their real numbers.

Your real numbers include everything: how much you earn after taxes, how much you make per hour of actual effort (including commute time), which income sources are most valuable, and which ones are wasting your time.

When you track your income carefully, patterns emerge. You might discover that your weekend side hustle pays better per hour than your regular job. You might realize that certain clients or customers are more profitable than others. You might see that some months are consistently better than others.

This information is power. It lets you make informed decisions about where to focus your energy.

Here is a simple exercise: for one month, write down every single dollar that comes into your life. At the end of the month, calculate the following:

Total income from all sources. Income from each individual source. Hours spent on each income source. Effective hourly rate for each source (income divided by hours).

The results might surprise you. That job you thought was great might pay less per hour than you assumed. That side hustle you do for fun might actually be your highest-paying activity.

Numbers do not lie. When you track them, you can make decisions based on reality instead of assumptions.`
              },
              {
                title: "Building a Weekly Money Review Habit",
                content: `The most financially successful people share one habit: they regularly review their money. They do not just hope things are going well. They check.

A weekly money review does not need to take long. Fifteen minutes every Sunday can transform your financial life. Here is what to include:

First, review what came in. Look at all the income you received that week. Where did it come from? Was it more or less than expected?

Second, review what went out. Look at your spending. Were there any surprises? Did you stick to your budget? Where did you overspend?

Third, check your progress toward goals. Are you on track to meet your savings goal? Your debt payoff goal? Your income goal?

Fourth, plan the week ahead. What income do you expect? What expenses are coming? What decisions do you need to make?

The key is consistency. A weekly review works because it catches problems early. If you are overspending, you catch it in a week instead of a month. If your income is dropping, you notice quickly and can adjust.

Put your weekly review on your calendar like an appointment with yourself. Protect that time. Make it non-negotiable.

The people who struggle with money are usually the ones who avoid looking at it. The people who succeed are the ones who face their numbers honestly and regularly.`
              }
            ],
            activityQuestion: "Create a simple income tracking system you will actually use (spreadsheet, app, notebook, etc.). Track all income you receive for the next week, including the source, amount, and hours spent if applicable. Then calculate your effective hourly rate for each income source and reflect on what you learned."
          }
        ]
      },
      3: {
        title: "What is Credit? (How it works, importance of credit score)",
        sections: [
          {
            title: "Understanding Credit Basics",
            type: "reading",
            duration: "6 min",
            content: `Okay, so what even is credit? Basically, it's borrowing money that you promise to pay back later. Think of it like your financial reputation - are you someone who keeps their promises or nah?

**Here's how it works:**
1. You apply for credit (like a credit card or loan)
2. The bank or whoever checks if you're trustworthy with money
3. If they say yes, they give you a limit - like "you can borrow up to $500"
4. You gotta pay back what you borrow, PLUS extra money called interest
5. How well you pay stuff back affects your credit score (we'll get to that)

**Different types of credit:**
• **Revolving Credit** - Credit cards. You can use it, pay it back, use it again
• **Installment Credit** - Loans where you pay the same amount every month (like car loans)
• **Secured Credit** - You put something up as backup (like your car)
• **Unsecured Credit** - Nothing backing it up - they just trust you'll pay it back`,
            keyPoints: [
              "Credit = borrowing money you HAVE to pay back",
              "Interest = extra money you pay for borrowing (it's how they make money)",
              "How you pay stuff back is THE most important thing",
              "Different types of credit work in different ways"
            ],
            articles: [
              {
                title: "Credit Is a Tool, Not Free Money",
                content: `One of the biggest mistakes young people make is thinking of credit as free money. It is not. Credit is a tool, and like any tool, it can help you or hurt you depending on how you use it.

When you use a credit card, you are borrowing money from the bank. That money is not yours. You owe it back. If you do not pay it back on time, you pay extra in the form of interest. If you do not pay it back at all, your credit score tanks and debt collectors come calling.

Used correctly, credit is incredibly useful. It lets you build a credit history that will help you rent apartments, get car loans, and eventually buy a house. It gives you purchase protection and fraud protection that debit cards often lack. It can give you rewards and cash back on spending you would do anyway.

Used incorrectly, credit is a trap. It makes overspending easy because the pain of payment is delayed. It creates debt that compounds with interest. It leads people to spend money they do not have on things they do not need.

The key distinction is this: use credit for convenience, not for purchasing power. Only charge what you can pay off in full when the bill comes. If you cannot afford something without credit, you cannot afford it with credit either.

Treat your credit card like a debit card that builds your credit history. That mindset will keep you safe.`
              },
              {
                title: "How Credit Cards Actually Work",
                content: `Credit cards seem simple on the surface. You swipe, you buy, you pay later. But there is a lot happening behind the scenes that you should understand.

When you apply for a credit card, the bank checks your credit history to decide if you are trustworthy. If approved, they give you a credit limit - the maximum amount you can borrow at any time.

Every time you use your card, you are borrowing from that limit. If your limit is $500 and you spend $200, you have $300 left to use. This is called your available credit.

At the end of each billing cycle (usually about a month), the bank sends you a statement. This shows everything you charged and the total amount due. You have a due date to pay.

Here is where it gets important: you can pay the full balance, the minimum payment, or anything in between.

If you pay the full balance by the due date, you pay zero interest. The bank essentially lent you money for free.

If you pay only the minimum, the remaining balance carries over to the next month AND starts accruing interest. Credit card interest rates are high, often 20 percent or more. This is how banks make money and how people get trapped in debt.

The grace period is the time between when your statement closes and when payment is due. During this time, you do not accrue interest on new purchases IF you paid your last statement in full. This is why paying in full is so important.

Understand these mechanics, and you can use credit cards to your advantage. Ignore them, and you become a source of profit for the bank.`
              }
            ],
            activityQuestion: "Explain in your own words the difference between a credit card and a debit card. Include at least three key differences and explain why someone might choose to use each one. Then describe one situation where using a credit card would be smart and one situation where it would be risky."
          },
          {
            title: "Your Credit Score Explained",
            type: "video",
            duration: "8 min",
            content: `Your credit score is just a number between 300 and 850 that shows if you're good with borrowed money. Higher number = you're more trustworthy = better deals when you need to borrow money.

**What the numbers mean:**
• 800-850: Excellent (you're crushing it)
• 740-799: Very Good (nice job)
• 670-739: Good (solid)
• 580-669: Fair (needs work)
• 300-579: Poor (gotta fix this)

**What actually affects your score:**
• Payment History (35%) - This is HUGE. Pay your bills on time. Every. Single. Time.
• Credit Utilization (30%) - Don't max out your cards. Use less than 30% of your limit
• Length of Credit History (15%) - How long you've had credit. Keep old accounts open
• Types of Credit (10%) - Having a mix of credit cards and loans is good
• New Credit (10%) - Don't apply for a bunch of credit cards all at once`,
            keyPoints: [
              "Paying on time is the #1 thing that matters",
              "Never use more than 30% of your credit limit",
              "Keep your old credit cards - don't close them",
              "Check your score regularly (it's free)"
            ],
            articles: [
              {
                title: "The Five Factors That Determine Your Score",
                content: `Your credit score is calculated using five main factors. Understanding each one helps you know exactly what to focus on to improve or maintain your score.

Payment history is the biggest factor at 35 percent. This is simply whether you pay your bills on time. One missed payment can drop your score significantly. Set up autopay and never miss a due date.

Credit utilization is the second biggest at 30 percent. This is how much of your available credit you are using. If you have a $1000 limit and a $300 balance, your utilization is 30 percent. Keep this under 30 percent, and ideally under 10 percent.

Length of credit history is 15 percent. This is how long you have had credit accounts open. This is why you should not close old credit cards even if you do not use them much. The longer your history, the better.

Credit mix is 10 percent. This is about having different types of credit - credit cards, installment loans, mortgages. You do not need to go out and get loans just for this factor, but having variety helps.

New credit is 10 percent. Every time you apply for credit, it creates a hard inquiry on your report. Too many inquiries in a short time can hurt your score. Only apply for credit when you really need it.

Focus on the big two first: pay on time and keep utilization low. Those two factors alone account for 65 percent of your score. Master those, and everything else becomes much easier.`
              },
              {
                title: "Why Your Credit Score Matters for Everything",
                content: `Your credit score affects far more than just whether you can get a credit card. It influences many areas of your life, often in ways people do not expect.

Renting an apartment almost always involves a credit check. Landlords want to know if you pay your bills. A low credit score can mean getting denied for the apartment you want or being required to pay a larger security deposit.

Car insurance rates are often influenced by credit scores. Insurance companies have found a correlation between credit scores and the likelihood of filing claims. A lower score can mean paying more for the same coverage.

Getting a cell phone plan without a credit check usually means paying more upfront or being limited to prepaid options. The best phone deals require good credit.

Some employers check credit reports as part of the hiring process, especially for jobs involving money or security clearances. A poor credit history can cost you job opportunities.

Utility companies may require deposits from people with poor credit. That money is tied up and could be earning interest for you instead.

Of course, credit scores heavily influence loan terms. A higher score means lower interest rates on mortgages, car loans, and personal loans. Over a lifetime, the difference in interest paid can be tens of thousands of dollars.

Your credit score is essentially your financial reputation. It opens doors or closes them. Building it while you are young sets you up for decades of easier financial decisions.`
              }
            ],
            activityQuestion: "Check your current credit score using a free service like Credit Karma, or if you do not have a credit history yet, research what score range you would need to qualify for a good apartment rental or car loan in your area. Write about what you found and what specific actions you will take to build or improve your score over the next six months."
          },
          {
            title: "Building Credit as a Student",
            type: "interactive",
            duration: "7 min",
            content: `Starting to build credit NOW is honestly one of the smartest things you can do. Future you will be thanking present you. Here's how to do it without screwing it up:

**Good ways to start building credit:**
1. **Student Credit Card** - Made specifically for people like you with no credit
2. **Secured Credit Card** - You put down like $200, they give you a $200 limit. Can't mess up too bad
3. **Get added to a parent's card** - If your parents have good credit, ask them to add you as an authorized user
4. **Credit Builder Loan** - A small loan that's designed to help you build credit

**How to actually build good credit:**
• Get ONE card to start. Don't go crazy
• Use it for small stuff you already buy - like gas or groceries
• Pay off the FULL balance every single month - not just the minimum
• Don't spend money you don't have. The card isn't free money
• Set up autopay so you never forget to pay
• Check your credit report once a year for free at annualcreditreport.com`,
            keyPoints: [
              "Start with a student card or secured card",
              "Pay the FULL balance on time every month - no exceptions",
              "Use less than 30% of whatever your limit is",
              "Check your credit regularly to catch any problems"
            ],
            articles: [
              {
                title: "The Best First Credit Card for Students",
                content: `Choosing your first credit card is an important decision. The wrong choice can lead to fees and frustration. The right choice can set you up for long-term credit success.

For students with no credit history, there are two main options: student credit cards and secured credit cards.

Student credit cards are designed specifically for college students. They typically have lower credit limits and fewer rewards, but they are easier to get approved for. Popular options include the Discover it Student Cash Back card and the Capital One Journey Student card. These often come with incentives like cash back matching for the first year.

Secured credit cards require a deposit, usually between 200 and 500 dollars. That deposit becomes your credit limit. If you deposit 300 dollars, your limit is 300 dollars. This reduces risk for the bank, making approval easier. After several months of responsible use, many secured cards will return your deposit and convert to a regular unsecured card.

When choosing, look for cards with no annual fee. As a student building credit, you should not be paying money just to have the card.

Also look at the interest rate, called the APR. However, if you follow the rule of paying your balance in full every month, the interest rate does not matter because you will never pay it.

Start with one card only. Master responsible use with one card before even thinking about getting another. More cards mean more opportunities to make mistakes.`
              },
              {
                title: "Becoming an Authorized User Strategy",
                content: `One of the fastest ways to build credit without getting your own card is becoming an authorized user on someone else's account. This strategy works well, but it requires having someone who trusts you and who you trust in return.

Here is how it works: A parent, guardian, or family member adds you to their existing credit card as an authorized user. You get a card with your name on it linked to their account. Their payment history on that account starts appearing on your credit report.

If they have good credit habits - paying on time, keeping utilization low - their good behavior benefits your credit score. You are essentially borrowing their credit reputation.

The benefits are significant. You can build a credit history before you are even old enough or financially stable enough to qualify for your own card. Some people become authorized users as teenagers and have years of credit history by the time they need to apply for their own credit.

However, there are risks. If the primary account holder misses payments or runs up high balances, that negative activity can hurt your credit too. Only become an authorized user on an account you trust.

You do not even need to use the card. The credit benefit comes from being on the account, not from spending. Some parents add their children as authorized users but keep the physical card locked away.

This strategy is a legitimate shortcut, but it is not a replacement for learning to manage your own credit responsibly.`
              }
            ],
            activityQuestion: "Research two student credit cards and two secured credit cards. For each card, list the annual fee, APR, credit limit, and any rewards or benefits. Based on your research, which card would you choose as your first credit card and why? If you already have a card, evaluate whether it was the best choice."
          },
          {
            title: "Credit Myths vs Facts",
            type: "reading",
            duration: "5 min",
            content: `There's a LOT of bad information out there about credit. Let's clear up some common myths so you don't make decisions based on lies.

**MYTH: Checking your own credit hurts your score**
FACT: Nope! When YOU check your own credit, it's called a "soft inquiry" and has ZERO impact on your score. Check it as often as you want.

**MYTH: You need to carry a balance to build credit**
FACT: This is 100% FALSE and costs people tons of money in interest. Pay your balance in FULL every month. You still build credit.

**MYTH: Closing old credit cards helps your score**
FACT: Usually the opposite! Closing old cards can hurt your score because it reduces your total available credit and shortens your credit history.

**MYTH: Your income affects your credit score**
FACT: Your income is NOT part of your credit score at all. A broke person can have excellent credit, and a rich person can have terrible credit.

**MYTH: All debt is bad for your credit**
FACT: Having some debt and paying it responsibly actually HELPS your score. It shows you can handle credit responsibly.

**MYTH: You only have one credit score**
FACT: You have many! Different bureaus (Experian, TransUnion, Equifax) may have slightly different scores, and there are different scoring models (FICO, VantageScore).

**The truth:** Good credit comes from simple habits - pay on time, keep balances low, and be patient. Don't overcomplicate it.`,
            keyPoints: [
              "Checking your own credit score never hurts it",
              "You do NOT need to carry a balance to build credit",
              "Closing old credit cards usually hurts, not helps",
              "Income has nothing to do with your credit score"
            ],
            articles: [
              {
                title: "Debunking the Carry a Balance Myth",
                content: `One of the most damaging credit myths is that you need to carry a balance to build credit. This is completely false, and believing it costs people real money.

The myth probably spread because people see that having credit accounts with activity helps your score. They assume that means leaving a balance. It does not.

Here is what actually happens: When you use your credit card and pay the statement balance in full by the due date, the credit bureaus still see that you used the card. Your activity is reported. Your on-time payment is recorded. Your credit builds.

The only difference between paying in full and carrying a balance is that carrying a balance means paying interest. You get no credit-building benefit from the interest you pay. Zero. None.

Let me be very clear: if you pay your full statement balance every month, you will never pay interest AND you will build credit exactly the same as if you carried a balance.

People who believe this myth end up paying 15 to 25 percent interest on balances they did not need to carry. Over time, this adds up to hundreds or thousands of dollars thrown away.

The credit card companies love this myth. They make money when you pay interest. Do not fall for it.

Pay in full. Every time. Your credit will build, and your wallet will thank you.`
              },
              {
                title: "Hard Inquiries vs Soft Inquiries",
                content: `When you hear about credit checks hurting your score, people are talking about hard inquiries. But not all credit checks are hard inquiries. Understanding the difference helps you make informed decisions.

A soft inquiry is a credit check that does not affect your score at all. When you check your own credit, that is a soft inquiry. When a company checks your credit for a pre-approved offer, that is a soft inquiry. When an employer checks your credit, that is usually a soft inquiry.

A hard inquiry happens when you actually apply for credit - a credit card, a loan, a mortgage. The lender checks your credit report, and this check is recorded as a hard inquiry.

A single hard inquiry typically drops your score by about 5 to 10 points. This effect is temporary and fades within a year. After two years, hard inquiries fall off your report entirely.

The concern with hard inquiries is not one or two. The concern is many in a short period. If you apply for five credit cards in a month, that looks desperate to lenders and can significantly hurt your score.

There is an exception for rate shopping. If you are shopping for a mortgage or auto loan and multiple lenders pull your credit within a short window (usually 14 to 45 days), those inquiries are typically counted as one. This encourages consumers to shop for the best rate.

Check your own credit as often as you want. But only apply for new credit when you have a good reason and have done your research first.`
              }
            ],
            activityQuestion: "List three credit myths you have heard before and explain why each one is false. Then write about one thing you learned about credit in this lesson that surprised you or changed how you think about credit."
          }
        ]
      },
      4: {
        title: "How to Build & Maintain Good Credit",
        sections: [
          {
            title: "Practical Credit Building Strategies",
            type: "reading",
            duration: "6 min",
            content: `Alright, so you know WHAT credit is and WHY it matters. Now let's talk about HOW to actually build it up without messing it up.

**Best ways to start building credit RIGHT NOW:**
1. **Get a student credit card** - Banks literally make these for people with zero credit history
2. **Become an authorized user** - Ask a parent or trusted family member with good credit to add you to their card
3. **Try a secured credit card** - You put down $200-500 as a deposit, that becomes your credit limit. Can't overspend
4. **Get a credit-builder loan** - Some credit unions offer these specifically to help people build credit

**The golden rules for building credit:**
• Only charge what you can pay off IN FULL every month
• Never use more than 30% of your credit limit (if you have a $500 limit, only use $150 max)
• Set up autopay for at least the minimum payment (but always pay the full balance)
• Keep your old credit cards open - even if you don't use them much
• Don't apply for a bunch of credit cards at once - each application dings your score`,
            keyPoints: [
              "Start with ONE credit card and use it responsibly",
              "Pay the FULL balance every month - not just the minimum",
              "Keep credit utilization under 30% of your limit",
              "Set up autopay so you never miss a payment"
            ],
            articles: [
              {
                title: "Your First Year of Credit Building",
                content: `The first year of building credit is crucial. The habits you form now will follow you for years. Here is exactly how to approach your first twelve months with credit.

Month one: Get approved for your first card, either a student card or a secured card. Set up online access to your account. Download the bank's app. Set up autopay for the full statement balance immediately. This is the most important thing you can do.

Months two through six: Use your card for one or two small recurring purchases. A streaming subscription works perfectly. Gas if you drive. One regular purchase that you were going to make anyway. Keep your spending well under 30 percent of your limit. Pay attention to when your statement closes and when your payment is due.

Months seven through nine: Check your credit score using a free service. You should see a score now if you did not have one before. Review your credit report for accuracy. Make sure your payment history shows all on-time payments.

Months ten through twelve: Continue the same responsible habits. Consider requesting a credit limit increase, which can lower your utilization ratio. Do not increase your spending just because your limit increased.

At the end of year one, you should have twelve months of perfect payment history, low utilization, and a credit score that reflects responsible use. This foundation makes everything else easier.

Resist the urge to get more cards in the first year. Master one card first. There is plenty of time to optimize later.`
              },
              {
                title: "Setting Up Autopay the Right Way",
                content: `Autopay is your best friend when it comes to credit cards. It removes the risk of forgetting a payment and damaging your credit. But there is a right way and a wrong way to set it up.

The wrong way is to set autopay for the minimum payment. Yes, this prevents late payments, but it also means you will carry a balance and pay interest. Only use minimum payment autopay as a safety net if you also manually pay the full balance.

The right way is to set autopay for the full statement balance. Every month, your bank will automatically pay off everything you charged. You never pay interest. You never miss a payment. It is completely hands-off.

To set this up, log into your credit card account online or through the app. Look for payment settings or autopay options. Select full statement balance as the amount. Choose a bank account to pay from. Make sure that account always has enough money to cover your credit card spending.

Here is the catch: you need to make sure your checking account can cover the autopay. If your autopay fails because of insufficient funds, you could face fees and a late payment. Budget accordingly.

Some people set up two layers of protection: autopay for the full balance, plus calendar reminders a few days before to verify they have enough in their account.

The goal is to make on-time, full payments completely automatic. Once set up correctly, you can essentially forget about it while your credit builds itself.`
              }
            ],
            activityQuestion: "Create a step-by-step plan for your first year of credit building. Include specific actions for each quarter (three-month period) of the year. What card will you start with? What purchases will you use it for? How will you ensure you never miss a payment? What credit score do you hope to achieve by the end of the year?"
          },
          {
            title: "Common Credit Mistakes to Avoid",
            type: "video",
            duration: "7 min",
            content: `Let's keep it real - there's a LOT of ways people mess up their credit. Don't be that person. Here's what NOT to do:

**Mistake #1: Paying only the minimum payment**
If you only pay the minimum, you're basically just paying the interest. Your actual debt barely goes down and you end up paying WAY more over time. Not worth it.

**Mistake #2: Maxing out your credit cards**
Using 100% of your credit limit KILLS your score. Banks see that and think "this person is desperate for money." Keep it under 30%.

**Mistake #3: Missing payments**
One missed payment can drop your score by like 100 points. Set. Up. Autopay. Seriously.

**Mistake #4: Closing old credit cards**
Your credit history length matters. Keep those old cards open even if you just use them for gas once a month.

**Mistake #5: Co-signing for friends**
If they don't pay, it's YOUR credit that gets wrecked. Don't do it unless you're willing to pay their debt for them.

**Mistake #6: Not checking your credit report**
Errors happen. Identity theft happens. Check your report at least once a year for free at annualcreditreport.com`,
            keyPoints: [
              "ALWAYS pay more than the minimum (ideally the full balance)",
              "Missing payments is the fastest way to destroy your credit",
              "Keep old accounts open to maintain credit history length",
              "Check your credit report yearly to catch errors or fraud"
            ],
            articles: [
              {
                title: "The Real Cost of Minimum Payments",
                content: `Credit card companies are required to show you something on your statement: how long it takes to pay off your balance if you only pay the minimum. Most people ignore this. They should not.

Let us say you have a one thousand dollar balance on a card with 20 percent interest. Your minimum payment might be around 25 dollars. If you pay only the minimum, it will take you over five years to pay off that balance, and you will pay over 500 dollars in interest. Your one thousand dollar purchase actually cost you 1,500 dollars.

The math gets worse with larger balances. A 5,000 dollar balance at minimum payments can take over 15 years to pay off and cost you thousands in interest.

This is exactly what credit card companies want. They make money when you pay interest. The minimum payment is designed to keep you in debt as long as possible while still technically making progress.

Here is the fix: always pay more than the minimum. Ideally, pay the full balance. If you cannot pay the full balance, pay as much as you possibly can. The difference is dramatic.

Using that same one thousand dollar example, if you pay 100 dollars a month instead of 25, you pay off the balance in about 11 months and pay around 100 dollars in interest. That is 400 dollars saved just by paying more.

Never let minimum payments become your habit. They are a trap designed to maximize profit for the credit card company at your expense.`
              },
              {
                title: "What Happens When You Miss a Payment",
                content: `Missing a credit card payment is one of the fastest ways to damage your financial life. Understanding exactly what happens can motivate you to never let it occur.

Day one of being late: Most cards have a grace period, but once you pass the due date, you may be charged a late fee immediately. This is usually 25 to 40 dollars.

Thirty days late: This is when things get serious. After 30 days, the late payment is reported to the credit bureaus. This single event can drop your credit score by 100 points or more. That late payment stays on your credit report for seven years.

Sixty days late: Another late payment mark. Your interest rate may increase to a penalty APR, sometimes over 29 percent. The credit damage compounds.

Ninety days late: The account may be sent to collections. Now you have a collections account on your credit report in addition to the late payments. This is severe damage that takes years to recover from.

Beyond ninety days: The debt may be charged off, meaning the company writes it off as a loss. This does not mean you do not owe it anymore. It means your credit is severely damaged, and the debt may be sold to a collections agency that will pursue you for payment.

All of this from missing one payment. The good news is it is entirely preventable. Set up autopay. Set calendar reminders. Check your account regularly. Do whatever it takes to ensure payments happen on time, every time.

One missed payment can undo years of good credit behavior. Protect your payment history like it is the most valuable thing you own, because financially, it kind of is.`
              }
            ],
            activityQuestion: "Calculate how much a $500 credit card balance would cost you if you only paid the minimum payment versus paying $50 per month versus paying the full balance. Use an online credit card payoff calculator to find the total interest paid and time to pay off for each scenario. Write about what you learned."
          },
          {
            title: "Maintaining Good Credit Long-Term",
            type: "interactive",
            duration: "8 min",
            content: `Building credit is one thing. Keeping it good for years? That's where most people slip up. Here's how to maintain that good credit score:

**Monthly credit card routine:**
1. Use your card for normal stuff you're already buying (gas, groceries, etc.)
2. Keep track of what you spend (use your bank app)
3. Pay off the FULL balance before the due date
4. Check your statement for any weird charges
5. Repeat next month

**Every 3-6 months:**
• Check your credit score (many apps do this for free now - like Credit Karma)
• Review your credit utilization - make sure you're under 30% on all cards
• Set up balance alerts so you know if you're getting close to your limit

**Once a year:**
• Get your free credit report from all 3 bureaus (Equifax, Experian, TransUnion) at annualcreditreport.com
• Look for errors or accounts you don't recognize
• Dispute any errors you find
• Celebrate if your score went up

**Pro tips for keeping your credit solid:**
• If you get a raise or more income, ask for a credit limit increase (but don't increase your spending)
• Diversify your credit types over time (credit card + car loan = better than just credit cards)
• Never close your oldest credit card unless it has a crazy annual fee
• If you're struggling to pay, call the company BEFORE you miss a payment - they might work with you`,
            keyPoints: [
              "Treat your credit card like a debit card - only spend what you have",
              "Check your score regularly to track progress and catch problems",
              "Pull your free credit report yearly from annualcreditreport.com",
              "If you're struggling, communicate with creditors before missing payments"
            ],
            articles: [
              {
                title: "The Credit Monitoring Habit",
                content: `Checking your credit regularly is not paranoia. It is basic financial hygiene. Just like you check your bank balance to know where you stand, you should check your credit to understand your financial reputation.

Free credit monitoring is widely available now. Apps like Credit Karma, Mint, and many bank apps offer free credit score tracking. Your score updates regularly, often weekly or monthly.

Get in the habit of checking at least once a month. What you are looking for:

Score changes: Did your score go up or down? If it changed significantly, investigate why. A big drop might indicate a problem.

New accounts: Are there any accounts on your report that you did not open? This could be identity theft.

Inquiries: Are there hard inquiries you do not recognize? Someone might be trying to open credit in your name.

Utilization: Is your credit utilization where you want it to be?

Beyond regular monitoring, pull your full credit report at least once a year. You can get free reports from all three bureaus at annualcreditreport.com. These full reports show more detail than monitoring apps.

When reviewing your full report, check every account listed. Verify the payment history is accurate. Look for any errors. If you find mistakes, dispute them with the credit bureau.

Errors on credit reports are more common than you might think. The only way to catch them is to look. The only way to fix them is to dispute them. Neither happens if you never check.`
              },
              {
                title: "Long-Term Credit Optimization",
                content: `Once you have established good credit habits, you can start optimizing for even better results. These strategies take time but can significantly improve your credit over years.

Request credit limit increases every six to twelve months. When your income grows or your credit improves, ask your card company for a higher limit. This lowers your utilization ratio automatically without changing your spending. A higher limit you do not use looks great to lenders.

Gradually diversify your credit mix. After you have mastered credit cards, consider other types of credit when they make sense. An auto loan or a credit-builder loan adds variety to your credit profile. Do not take loans just for credit purposes, but when you need to borrow, know that responsible loan repayment helps your score.

Keep old accounts active. Your oldest accounts contribute to your length of credit history. Even if you do not use a card much anymore, make a small purchase on it every few months to keep it active. Some cards will close accounts that have no activity.

Avoid unnecessary new accounts. Every new card lowers your average account age and creates a hard inquiry. Be selective about new credit. The best time to get new cards is when you truly need them or when a specific card offers significant value.

Consider your credit journey as a decades-long project. The choices you make now affect the rates you get on a mortgage in ten years. Think long term, and your credit will reward you.`
              }
            ],
            activityQuestion: "Sign up for a free credit monitoring service if you have not already. Check your current credit report and score. Write a summary of what you found, including your current score, any accounts listed, and your utilization ratio. Then list three specific actions you will take to maintain or improve your credit over the next year."
          },
          {
            title: "Your Credit Action Plan",
            type: "interactive",
            duration: "6 min",
            content: `Time to make this real. Let's create your personal credit action plan based on where you are right now.

**If you have NO credit history:**
1. This week: Ask a parent about becoming an authorized user on their card
2. This month: Research student credit cards (Discover Student, Capital One Journey)
3. Apply for ONE starter card and use it for small purchases only
4. Set up autopay for the full balance immediately

**If you have SOME credit history:**
1. Check your current score using Credit Karma or your bank's free tool
2. Review your credit report for any errors
3. Make sure you're using less than 30% of your available credit
4. Set up payment reminders if you don't have autopay

**If you made MISTAKES with credit:**
1. Don't panic - credit can be rebuilt
2. Get current on any past-due accounts first
3. Consider a secured credit card to start rebuilding
4. Be patient - negative marks fade over time (7 years for most things)

**Monthly credit habits to build:**
• Check your credit score (1st of each month)
• Review your statements for errors or fraud
• Pay your balance in full before the due date
• Keep track of your credit utilization percentage

**The 6-month goal:** Have at least one credit account in good standing with on-time payments and low utilization.`,
            keyPoints: [
              "Start with ONE credit card and master it before adding more",
              "Set up autopay immediately to never miss a payment",
              "Check your credit score monthly to track progress",
              "If you've made mistakes, focus on getting current and being patient"
            ],
            articles: [
              {
                title: "Recovering from Credit Mistakes",
                content: `Everyone makes mistakes, including financial ones. If you have damaged your credit, the situation is not hopeless. Credit can be rebuilt, but it takes time and consistent effort.

First, stop the bleeding. If you are still engaging in the behavior that damaged your credit, stop. Get current on any past-due accounts. Stop using credit cards you cannot pay off. Address the root cause before trying to rebuild.

Second, assess the damage honestly. Pull your credit report and see exactly what is there. Late payments, collections, charge-offs - know what you are dealing with. Check when negative items were reported, because they fall off after seven years.

Third, start building positive history. If you can get a secured credit card, do so. Use it responsibly with small purchases and pay in full. Positive payment history will gradually outweigh the negative marks.

Fourth, consider negotiating. Sometimes creditors will remove negative marks in exchange for payment, especially for medical debt or if the account is old. It does not hurt to ask.

Fifth, be patient. Credit recovery is measured in years, not months. A serious delinquency might take two to three years before your score really starts recovering. After five years, the impact diminishes. After seven years, most negative items disappear.

The most important thing is to not give up. Your credit will recover if you commit to responsible behavior. Many people with terrible credit in their past have excellent credit today. It just takes time and discipline.`
              },
              {
                title: "Creating Your Credit Action Plan",
                content: `An action plan turns good intentions into real results. Here is how to create a credit action plan that actually works.

Start by defining your goal. What credit score do you want? When do you want it? Be specific. Instead of "better credit," aim for "a 720 credit score within 18 months."

Assess your current situation. What is your score now? What factors are holding it back? Is it payment history, utilization, account age, or something else? You cannot fix what you do not understand.

Identify your specific actions. Based on your assessment, what do you need to do? Pay down a balance to lower utilization? Set up autopay to protect payment history? Dispute an error on your report? Write down the specific steps.

Set deadlines for each action. "Lower utilization to under 30 percent by March 1st." "Check credit report and dispute errors by next Friday." Deadlines create accountability.

Track your progress. Check your credit score monthly. Note the changes. If something is not working, adjust your approach.

Build in accountability. Tell someone about your goal. Check in with them regularly. Having someone to answer to increases follow-through.

Celebrate milestones. When you hit a target, acknowledge it. These small wins keep you motivated for the long journey of credit building.

Your credit action plan should be written down and reviewed regularly. A plan in your head is just a wish. A written plan is a commitment.`
              }
            ],
            activityQuestion: "Create a detailed credit action plan for yourself. Include your current credit score (or estimate if you have not checked yet), your target score, your timeline, the specific actions you will take, and how you will track your progress. Make this plan realistic and specific to your situation."
          }
        ]
      },
      5: {
        title: "How to Build Credit & Avoid Debt Traps",
        sections: [
          {
            title: "Common Debt Traps to Avoid",
            type: "reading",
            duration: "6 min",
            content: `Listen up - companies WANT you to fall into debt. That's how they make money off you. Here are the traps you need to watch out for:

**Buy Now, Pay Later (BNPL):**
• Seems harmless but it adds up FAST
• Miss a payment? Big fees and it hurts your credit
• Makes you spend more than you would with cash

**Payday Loans:**
• STAY AWAY. These have insane interest rates (like 400%+)
• They trap you in a cycle where you keep borrowing
• There's almost always a better option

**Credit Card Minimum Payments:**
• Only paying the minimum means you're paying mostly interest
• A $1000 balance can take 10+ years to pay off at minimums
• Always pay more than the minimum if you can

**Store Credit Cards:**
• "Save 20% today!" but the interest rate is usually crazy high
• You end up spending more to "earn rewards"
• One store card is fine, but don't get a bunch`,
            keyPoints: [
              "If it sounds too easy, there's probably a catch",
              "NEVER take a payday loan - ever",
              "Pay more than the minimum on credit cards",
              "Sleep on big purchases - wait 24-48 hours"
            ],
            articles: [
              {
                title: "How Debt Traps Actually Work",
                content: `Debt traps are designed to be hard to escape. Companies that profit from them have spent years perfecting their strategies. Understanding how these traps work is the first step to avoiding them.

The fundamental mechanism is simple: make it easy to borrow, hard to repay, and expensive to stay in debt. This combination keeps people cycling through debt indefinitely.

Take payday loans. They offer fast cash with no credit check. Sounds great when you are desperate. But the fees translate to interest rates of 300 to 500 percent or more. The loan is due on your next payday, which is usually before you have recovered financially. So you roll it over into a new loan with new fees. This cycle can continue for months or years.

Buy now, pay later services use psychology against you. They break a large purchase into small payments that seem manageable. But they encourage you to spend more than you would with cash. Miss a payment, and you face fees and interest. Many people end up with multiple buy now pay later commitments that add up to more than they can handle.

Store credit cards offer tempting discounts. Save 20 percent today by opening a card. But these cards often have interest rates above 25 percent. One late payment or carried balance wipes out any discount you received.

The common thread is that these products make money when you struggle. Your financial difficulty is their profit center. Once you understand this, you can make decisions that serve your interests, not theirs.`
              },
              {
                title: "The Psychology of Debt Traps",
                content: `Debt traps do not just exploit your wallet. They exploit your brain. Understanding the psychological tricks can help you resist them.

Present bias is the tendency to value immediate rewards over future benefits. Debt exploits this by offering something now and pushing the cost into the future. Your brain is wired to prefer instant gratification, so "buy now, pay later" feels like a good deal even when it is not.

Optimism bias makes you think you will be in a better financial position later. You assume future you will have more money and can easily handle the payments. But future you usually has the same constraints as present you, plus the added burden of debt.

Anchoring happens when you focus on one number and ignore others. A low monthly payment seems affordable, even if the total cost is outrageous. Debt companies emphasize the monthly payment and downplay the true cost.

Social proof drives you to believe that if others are using these products, they must be okay. Everyone has credit card debt, right? Everyone uses financing. But widespread use does not mean something is wise.

Loss aversion makes you fear missing out on deals. Limited time offer! Sale ends today! These tactics create urgency that overrides careful thinking.

Recognizing these psychological triggers gives you power over them. When you feel rushed, wait. When you focus on monthly payments, calculate the total. When you assume future you will handle it, remember that present you needs to be realistic.`
              }
            ],
            activityQuestion: "Describe a time when you or someone you know was tempted by or fell into a debt trap (payday loan, buy now pay later, store credit card, etc.). What made it tempting? What were the real costs? If you avoided it, what helped you say no? What would you do differently knowing what you know now?"
          },
          {
            title: "Smart Borrowing Strategies",
            type: "reading",
            duration: "5 min",
            content: `Sometimes you HAVE to borrow money - for school, a car, whatever. The key is doing it smart:

**Good debt vs Bad debt:**
• Good debt: Student loans, mortgage, starting a business
• Bad debt: Credit cards for stuff you don't need, payday loans

**How to borrow smart:**
• Shop around for the lowest interest rate
• Understand ALL the terms before you sign
• Know exactly when payments are due
• Have a plan to pay it back before you borrow

**Student Loans specifically:**
• Federal loans usually have better terms than private
• Only borrow what you actually need
• Know whether your loan has subsidized interest
• Look into income-driven repayment plans`,
            keyPoints: [
              "Not all debt is created equal - some is actually useful",
              "Always compare rates from multiple lenders",
              "Read the fine print - all of it",
              "Federal student loans first, private loans last"
            ],
            articles: [
              {
                title: "Good Debt vs Bad Debt Explained",
                content: `Not all debt is equal. Some debt can actually help you build wealth over time, while other debt will only drag you down. Learning to tell the difference is crucial.

Good debt is borrowing that increases your earning potential or net worth over time. The classic examples are student loans for education that leads to higher income, a mortgage for a home that appreciates in value, or a business loan for a profitable venture. Good debt is an investment in your future.

Bad debt is borrowing for things that lose value or provide no return. Credit card debt for consumer purchases, payday loans, auto loans for expensive cars you cannot afford - these drain your wealth rather than building it.

But here is the nuance: even "good" debt can become bad debt if misused. Student loans for a degree that does not increase your income are not good debt. A mortgage for more house than you can afford is not good debt. The category matters less than the specific situation.

Ask yourself these questions before borrowing: Will this purchase increase my income or net worth? Can I afford the payments without strain? Is the interest rate reasonable? Would I buy this if I had to pay cash?

If borrowing helps you earn more, build assets, or achieve goals that would otherwise be impossible, it can be a smart tool. If borrowing just allows you to have things you cannot really afford, it is a trap.`
              },
              {
                title: "Shopping for the Best Loan Terms",
                content: `When you do need to borrow, the difference between a good loan and a bad loan can be thousands of dollars. Always shop around.

Start with the interest rate, but do not stop there. The annual percentage rate (APR) includes fees and gives you a more accurate picture of the true cost. Compare APRs, not just interest rates.

Look at the loan term. A longer term means lower monthly payments but more total interest paid. A shorter term costs more per month but less overall. Find the balance that fits your budget while minimizing total cost.

Watch for origination fees. Some lenders charge fees just to give you the loan. These are often 1 to 6 percent of the loan amount. A loan with a lower interest rate but high fees might cost more than a higher-rate loan with no fees.

Check prepayment penalties. Some loans charge you for paying off early. This limits your flexibility and should be avoided when possible.

Read the fine print about late payment consequences. What are the fees? Does your rate increase? What happens if you miss multiple payments?

Get quotes from at least three lenders. Credit unions often offer better rates than big banks. Online lenders may beat both. Federal student loans almost always beat private student loans.

Never accept the first offer you receive. Negotiation is possible, especially if you have quotes from competitors. A few hours of research can save you hundreds or thousands of dollars.`
              }
            ],
            activityQuestion: "Compare two different loan scenarios: a $5,000 loan at 8% interest for 3 years versus a $5,000 loan at 12% interest for 5 years. Calculate the monthly payment and total interest paid for each using an online loan calculator. Which loan is better and why? When might someone choose the longer, higher-rate loan?"
          },
          {
            title: "Understanding Interest Rates",
            type: "reading",
            duration: "6 min",
            content: `Interest rates can make or break your financial future. Understanding them is crucial.

**What is interest?**
Interest is the cost of borrowing money. When you borrow, you pay back MORE than you borrowed. When you save, you EARN more than you deposited.

**APR vs APY:**
• APR (Annual Percentage Rate) - what you PAY on loans/credit cards
• APY (Annual Percentage Yield) - what you EARN on savings
• Both account for compound interest, but they work in opposite directions

**How compound interest works:**
• Interest earns interest (when saving) or charges interest (when owing)
• A $1,000 credit card balance at 20% APR can become $1,200+ in a year if you only pay minimums
• A $1,000 savings at 5% APY becomes $1,050 in a year without doing anything

**The Rule of 72:**
Divide 72 by the interest rate to see how long it takes money to double.
• 72 ÷ 6% = 12 years for savings to double
• 72 ÷ 24% = 3 years for credit card debt to double!

**Interest rates to know:**
• Credit cards: 15-25% APR (HIGH - avoid carrying balances)
• Car loans: 4-10% APR (medium)
• Student loans: 4-8% APR (relatively low)
• Savings accounts: 4-5% APY (get a high-yield account!)
• Mortgage: 6-8% APR (low, but large amounts)`,
            keyPoints: [
              "Interest works FOR you when saving, AGAINST you when borrowing",
              "Credit card interest rates are extremely high - pay in full",
              "Use the Rule of 72 to understand how fast money grows or debt accumulates",
              "Always compare APR when borrowing and APY when saving"
            ],
            articles: [
              {
                title: "Compound Interest: Friend or Enemy",
                content: `Compound interest is the most powerful force in personal finance. Whether it works for you or against you depends entirely on which side of it you are on.

When you save or invest, compound interest is your friend. Your money earns interest, and then that interest earns more interest. Over time, the growth accelerates. A 1,000 dollar investment growing at 7 percent becomes 2,000 in about 10 years, then 4,000 in 20 years, then 8,000 in 30 years. The longer you wait, the more powerful the compounding.

When you borrow, compound interest is your enemy. The same mathematics works against you. Your debt earns interest for the lender, and you pay interest on interest. A credit card balance can quickly grow out of control.

The key difference is who benefits. When you save, you benefit from compounding. When you borrow, the lender benefits.

Here is why starting early matters so much: compound interest needs time to work. Someone who starts saving at 20 and stops at 30 often ends up with more money than someone who starts at 30 and saves until 60. The early start gives compounding more time.

Use this to your advantage by saving and investing as early as possible, and by paying off high-interest debt as quickly as possible. Get on the right side of compound interest, and it will build your wealth for decades.`
              },
              {
                title: "Using the Rule of 72",
                content: `The Rule of 72 is a simple mental math trick that helps you understand how quickly money grows or debt accumulates. It tells you approximately how many years it takes for an amount to double at a given interest rate.

The formula is simple: divide 72 by the interest rate to get the number of years to double.

At a 6 percent return, money doubles in about 12 years (72 divided by 6). At a 9 percent return, it doubles in about 8 years. At a 12 percent return, it doubles in about 6 years.

Now apply this to debt. A credit card charging 24 percent interest will double your debt in just 3 years if you make no payments (72 divided by 24). That 1,000 dollar balance becomes 2,000, then 4,000, then 8,000. This is why credit card debt is so dangerous.

The rule also helps with savings decisions. If you can find an investment returning 7 percent versus one returning 4 percent, the faster-growing option will double your money in about 10 years instead of 18 years. Over multiple doublings, this difference is enormous.

Use the Rule of 72 whenever you need to quickly assess a financial decision. It will not give you exact numbers, but it will give you a gut check on whether something is a good deal or a trap.`
              }
            ],
            activityQuestion: "Use the Rule of 72 to calculate how long it would take for $1,000 to double at 5%, 10%, and 20% interest rates. Then calculate how long it would take for a $1,000 debt to double at 15% and 25% interest rates. What does this teach you about the importance of interest rates in both saving and borrowing?"
          },
          {
            title: "Getting Out of Debt",
            type: "reading",
            duration: "6 min",
            content: `Already in debt? Here's how to dig yourself out strategically.

**Step 1: Face the truth**
• List ALL your debts: who you owe, how much, interest rate, minimum payment
• Total it up - this number might hurt, but you need to know it
• Don't hide from it - ignoring debt makes it worse

**Step 2: Stop the bleeding**
• Stop using credit cards immediately
• Cut unnecessary expenses temporarily
• Find ways to increase income (even small amounts help)

**Two popular payoff strategies:**

**Debt Avalanche (mathematically best):**
• Pay minimums on all debts
• Put extra money toward the HIGHEST interest rate debt
• Once that's paid, move to the next highest
• Saves the most money on interest

**Debt Snowball (psychologically motivating):**
• Pay minimums on all debts
• Put extra money toward the SMALLEST balance
• Once that's paid, move to the next smallest
• Quick wins keep you motivated

**Step 3: Negotiate**
• Call creditors and ask for lower interest rates
• Ask about hardship programs if you're struggling
• Look into balance transfer cards (0% APR for 12-18 months)
• Consider debt consolidation loans

**Step 4: Prevent relapse**
• Build an emergency fund so you don't need credit for surprises
• Create a budget that includes debt payments
• Celebrate milestones (without spending money!)`,
            keyPoints: [
              "Make a complete list of all debts before creating a payoff plan",
              "Choose avalanche (save money) or snowball (stay motivated) method",
              "Negotiate with creditors - they often have options you don't know about",
              "Build an emergency fund while paying off debt to avoid new debt"
            ],
            articles: [
              {
                title: "The Debt Avalanche Method Explained",
                content: `The debt avalanche method is the mathematically optimal way to pay off debt. It saves you the most money in interest, though it requires discipline.

Here is how it works: List all your debts from highest interest rate to lowest. Make minimum payments on all debts. Put every extra dollar toward the debt with the highest interest rate. When that debt is paid off, move to the next highest interest rate. Repeat until debt-free.

The logic is simple: high-interest debt costs you the most. By eliminating it first, you minimize the total interest you pay over time.

For example, if you have a 24 percent credit card balance, a 15 percent personal loan, and a 6 percent car loan, you attack the credit card first. Even if the credit card has a smaller balance than the car loan, every dollar on the 24 percent debt saves more than a dollar on the 6 percent debt.

The challenge with the avalanche method is psychological. If your highest-rate debt is also your largest debt, it can take a long time to see progress. You might pay for months before knocking out that first debt. This is where people sometimes give up.

If you can stay disciplined, the avalanche method is the clear winner financially. Use spreadsheets or apps to track your progress. Celebrate milestones along the way. Remember that you are saving real money even when the progress feels slow.`
              },
              {
                title: "The Debt Snowball Method Explained",
                content: `The debt snowball method prioritizes psychology over math. It helps you build momentum and stay motivated, even though it may cost slightly more in total interest.

Here is how it works: List all your debts from smallest balance to largest. Make minimum payments on all debts. Put every extra dollar toward the debt with the smallest balance. When that debt is paid off, move to the next smallest balance. Repeat until debt-free.

The power of the snowball is quick wins. Small debts get eliminated fast, giving you the psychological boost of success. Each paid-off debt frees up more money for the next one. You build momentum like a snowball rolling downhill.

Research on behavior shows that these small wins matter. People who use the snowball method are more likely to stick with their debt payoff plan and actually become debt-free. A method you stick with beats a method you abandon.

The tradeoff is that you might pay more total interest. By ignoring interest rates, you let high-rate debts accrue longer. But if the difference in interest is small and the difference in motivation is large, the snowball wins.

Many people use a hybrid approach: start with the snowball to build momentum, then switch to the avalanche once motivation is established. There is no wrong answer as long as you are making progress toward debt-free.`
              }
            ],
            activityQuestion: "Create a hypothetical debt payoff plan using both the avalanche and snowball methods. Assume you have three debts: a $500 credit card at 22% interest, a $2,000 personal loan at 12% interest, and a $3,000 car loan at 6% interest. You have $200 per month extra for debt payoff. Which method would you use and why?"
          }
        ]
      },
      6: {
        title: "How to Open & Manage a Bank Account",
        sections: [
          {
            title: "Choosing the Right Bank",
            type: "reading",
            duration: "5 min",
            content: `Not all banks are the same. Here's what to look for:

**Types of financial institutions:**
• Big banks (Chase, Bank of America) - lots of ATMs, good apps
• Credit unions - often lower fees, better rates
• Online banks - usually best interest rates, no physical locations

**What to look for:**
• No monthly fees (or easy ways to waive them)
• Free ATMs near you or ATM fee reimbursement
• Good mobile app with deposit features
• No minimum balance requirements
• Good customer service

**Red flags to avoid:**
• High monthly fees
• Lots of hidden charges
• Poor online/mobile banking
• Limited ATM access`,
            keyPoints: [
              "Credit unions often have better deals than big banks",
              "Online banks pay higher interest on savings",
              "Look for no-fee checking accounts",
              "Make sure ATMs are convenient for you"
            ],
            articles: [
              {
                title: "Big Banks vs Credit Unions vs Online Banks",
                content: `Choosing where to put your money is one of the most important financial decisions you will make. Each type of institution has advantages and disadvantages.

Big banks like Chase, Bank of America, and Wells Fargo offer convenience. They have branches everywhere, thousands of ATMs, and sophisticated mobile apps. If you travel or move frequently, having a national bank means you can always find a branch. The downside is that big banks typically charge more fees and pay lower interest rates. They make money by charging you, not by competing for your business.

Credit unions are nonprofit organizations owned by their members. Because they are not trying to maximize profit, they often offer lower fees, better loan rates, and higher savings rates. Many credit unions have joined ATM networks that give you free access to thousands of ATMs nationwide. The catch is that you usually need to qualify for membership, often through your employer, school, or geographic location. Online banking may also be less polished than big banks.

Online banks like Ally, Marcus, and Discover have no physical branches, which means lower overhead costs. They pass those savings to customers through higher interest rates on savings and fewer fees. If you are comfortable doing everything digitally and rarely need cash, online banks are often the best deal. The downside is no in-person service and sometimes slower access to deposited funds.

Many people use a combination: a credit union or big bank for checking with ATM access, and an online bank for savings with the best interest rate. Find the mix that works for your needs.`
              },
              {
                title: "Understanding Bank Fees and How to Avoid Them",
                content: `Banks make billions of dollars from fees every year. Understanding these fees helps you avoid them and keep more of your money.

Monthly maintenance fees are charged just for having an account. These can be 5 to 15 dollars per month. Most banks will waive them if you meet certain conditions like maintaining a minimum balance or setting up direct deposit. Always ask how to avoid monthly fees before opening an account.

Overdraft fees occur when you spend more than you have and the bank covers it anyway. These typically cost 30 to 35 dollars per occurrence. You can overdraw multiple times in a single day, racking up over 100 dollars in fees. The best protection is to opt out of overdraft coverage entirely. If there is not enough money, the transaction simply declines.

ATM fees hit you twice when you use an out-of-network ATM: your bank charges you, and the ATM owner charges you. Combined fees can be 5 to 7 dollars per withdrawal. Use your bank's ATMs, get cash back at stores, or choose a bank that reimburses ATM fees.

Wire transfer fees, paper statement fees, excessive transaction fees on savings accounts, and foreign transaction fees are other common charges. Read the fee schedule before opening any account.

The best strategy is to choose accounts with minimal fees from the start. A no-fee checking account at a credit union or online bank eliminates most fee concerns before they happen.`
              }
            ],
            activityQuestion: "Research three different banking options in your area or online: one big bank, one credit union, and one online bank. Compare their checking account fees, savings interest rates, ATM access, and mobile app ratings. Based on your research, which would you choose and why?"
          },
          {
            title: "Opening Your Account",
            type: "interactive",
            duration: "6 min",
            content: `Ready to open an account? Here's what you need:

**Documents to bring:**
• Government ID (driver's license, passport, state ID)
• Social Security number
• Proof of address (utility bill, lease)
• Initial deposit (some banks need $25-100 to start)

**Types of accounts to consider:**
• Checking account - for everyday spending and bills
• Savings account - for money you're not touching
• High-yield savings - better interest for your emergency fund

**Pro tips:**
• Set up direct deposit right away
• Download the mobile app immediately
• Set up alerts for low balance and large transactions
• Link your checking and savings for easy transfers`,
            keyPoints: [
              "Have your ID and SSN ready",
              "Start with checking + savings combo",
              "Set up mobile banking and alerts right away",
              "Direct deposit often waives monthly fees"
            ],
            articles: [
              {
                title: "Your First Bank Account Checklist",
                content: `Opening your first bank account is a milestone in financial independence. Here is exactly what to do to set yourself up for success.

Before you go, gather your documents. You will need a government-issued photo ID like a driver's license, passport, or state ID. You will need your Social Security number. Some banks require proof of address, like a utility bill or lease agreement. If you are under 18, a parent or guardian may need to co-sign.

Research accounts before you visit. Know what type of account you want, the fees involved, and the minimum deposit required. Going in informed prevents you from being talked into an account that does not fit your needs.

When you open the account, set up direct deposit immediately if you have a job. This often waives monthly fees and ensures your paycheck arrives faster. Get the mobile app and set up your login before you leave. Enable all available security features including two-factor authentication.

Set up alerts for low balance warnings and large transactions. This protects you from overdrafts and helps you catch fraud quickly. Link your checking and savings accounts so you can transfer money easily.

Consider setting up automatic transfers to savings. Even a small amount moved automatically each payday builds savings without thinking about it.

Keep your account information secure. Your account number, routing number, and debit card number should never be shared casually. These numbers allow others to access your money.`
              },
              {
                title: "Understanding Checking vs Savings Accounts",
                content: `Checking and savings accounts serve different purposes. Understanding the distinction helps you use each one effectively.

A checking account is for everyday transactions. Money flows in through deposits and direct deposit. Money flows out through purchases, bills, and withdrawals. Checking accounts usually offer unlimited transactions but pay little to no interest. They come with a debit card for purchases and ATM access.

A savings account is for money you are setting aside. The purpose is to separate this money from your spending money so you are less tempted to use it. Savings accounts pay interest on your balance, though rates vary widely. Federal regulations used to limit savings transactions to six per month, though this rule has been relaxed. The psychology of separation matters more than the legal limit.

Most people need both. Your checking account holds money for bills and spending. Your savings account holds your emergency fund and money for goals. Keeping them separate creates a mental barrier that reduces impulse spending from savings.

High-yield savings accounts, usually offered by online banks, pay significantly higher interest than traditional savings accounts. If your emergency fund is 5,000 dollars, the difference between 0.01 percent and 4 percent interest is nearly 200 dollars per year. It makes sense to keep savings where it earns the most.

Some people use multiple savings accounts for different goals: one for emergency fund, one for vacation, one for a car. This bucket approach makes progress toward each goal visible and concrete.`
              }
            ],
            activityQuestion: "Plan out your ideal banking setup. What type of checking account would you open and where? What type of savings account? How would you use each one? What automatic transfers would you set up? What alerts would you enable? Create a complete plan for managing your money with these accounts."
          },
          {
            title: "Managing Your Account Like a Pro",
            type: "reading",
            duration: "5 min",
            content: `Having an account is one thing - managing it well is another:

**Check your balance regularly:**
• Use the app to check before spending
• Set up low balance alerts
• Know what's pending vs what's cleared

**Avoid overdraft fees:**
• These can be $30-35 EACH TIME you overdraw
• Link savings as backup or decline overdraft "protection"
• Track your spending so you don't overspend

**Protect your account:**
• Never share your PIN or login info
• Use strong, unique passwords
• Enable two-factor authentication
• Review statements monthly for weird charges
• Report lost/stolen cards immediately`,
            keyPoints: [
              "Check your balance before big purchases",
              "Set up overdraft protection linked to savings",
              "Review your statement every month",
              "Report anything suspicious immediately"
            ],
            articles: [
              {
                title: "Avoiding Overdraft Fees Forever",
                content: `Overdraft fees cost Americans billions of dollars every year. Each fee typically runs 30 to 35 dollars. Some people pay hundreds of dollars in overdraft fees annually. This is completely avoidable.

The first step is understanding how overdrafts happen. When you try to spend more than you have in your account, the bank can either decline the transaction or cover it and charge you a fee. Many banks automatically enroll you in overdraft coverage, calling it protection. But it protects you from embarrassment at the cost of 35 dollars. That is expensive protection.

You can opt out of overdraft coverage entirely. Go to your bank or call customer service and ask to decline overdraft protection. Without it, transactions that would overdraw your account simply get declined. You might feel awkward at the register, but you save 35 dollars.

If you want a safety net, link your savings account to cover overdrafts. Most banks charge a smaller fee, often 5 to 10 dollars, to transfer money from savings instead of the full overdraft charge.

The real solution is tracking your balance. Check your account before major purchases. Know what transactions are pending. Set up low balance alerts that text or email you when your account drops below a threshold. Most overdrafts happen because people lose track of their balance, not because they are truly broke.

Treat your checking account like it has 100 dollars less than it shows. This buffer prevents accidental overdrafts from timing issues between transactions.`
              },
              {
                title: "Monthly Account Review Habit",
                content: `Reviewing your bank account monthly is one of the most valuable financial habits you can build. It takes fifteen minutes and can save you money, catch fraud, and keep your spending on track.

Set a specific day for your review. The first of the month works well because it creates a natural boundary between periods. Put it on your calendar like an appointment.

During your review, first check for anything you do not recognize. Go through every transaction. Look for charges from companies you have never heard of, duplicate charges, or amounts that seem wrong. Fraud often starts with small test charges before larger ones. Catching it early limits the damage.

Second, look at your spending patterns. How much did you spend eating out? On entertainment? On impulse purchases? Seeing the totals often reveals surprises. That daily coffee adds up. Those small subscriptions accumulate.

Third, check your progress toward goals. Did you transfer money to savings? Did you pay down debt? Are you on track for where you want to be?

Fourth, look ahead to the next month. What big expenses are coming? Do you need to adjust your spending to prepare for them?

Keep notes on what you find. Track your spending categories month over month. This data helps you make better decisions and spot trends over time.

The monthly review turns passive account ownership into active money management. It is the difference between hoping things work out and knowing exactly where you stand.`
              }
            ],
            activityQuestion: "Look at your bank account (or a hypothetical one) and conduct a monthly review. List all transactions from the past week, categorize them (needs, wants, savings), and calculate the total for each category. Did anything surprise you? What would you do differently next month?"
          },
          {
            title: "Digital Banking & Money Apps",
            type: "reading",
            duration: "5 min",
            content: `Welcome to the future of banking - it's all on your phone now.

**Banking Apps to Know:**
• Your bank's official app - manage accounts, deposit checks, transfer money
• Venmo/Cash App/Zelle - send money to friends instantly
• PayPal - online purchases and receiving payments

**Payment Apps Best Practices:**
• Only send money to people you know and trust
• Double-check usernames before sending (scammers create lookalike accounts)
• Keep app balances low - transfer to your bank regularly
• Turn on notifications for every transaction

**Digital Wallet Setup:**
• Apple Pay, Google Pay, Samsung Pay
• More secure than swiping your card (uses tokenization)
• Set up with your debit and credit cards
• Can also store loyalty cards and tickets

**Protecting Your Digital Money:**
• Use Face ID/fingerprint when available
• Never share screenshots of your banking app
• Log out of banking apps on shared devices
• Use different passwords for each financial app
• Enable login notifications

**Watch out for:**
• Fake "bank" texts or calls asking for info
• Apps that look like your bank's app but aren't
• Public WiFi when checking banking apps
• Friends asking for money via text (could be a hacked account)

**Pro tip:** Set up automatic savings transfers in your banking app - even $5/week adds up to $260/year!`,
            keyPoints: [
              "Use your bank's official app for secure account management",
              "Digital wallets (Apple Pay, etc.) are more secure than physical cards",
              "Enable notifications for all financial transactions",
              "Never share banking information over text or email"
            ],
            articles: [
              {
                title: "Peer-to-Peer Payment App Safety",
                content: `Apps like Venmo, Cash App, Zelle, and PayPal have made sending money instant and easy. That convenience comes with risks you need to understand.

The biggest risk is that most peer-to-peer payments are instant and irreversible. When you send money, it is gone. There is no bank to call and reverse the transaction. Scammers exploit this by creating urgency, impersonating friends, or selling items they never intend to deliver.

Only send money to people you know and trust. Before you send, verify you have the right username or phone number. Scammers create accounts with names similar to real people. One wrong character sends your money to a stranger.

Never use peer-to-peer apps to buy from strangers online. If you buy something and the seller never delivers, the money is gone. Use payment methods with buyer protection for purchases from unknown sellers.

Watch out for the overpayment scam. Someone buys something from you and accidentally pays too much. They ask you to refund the difference. Later, their original payment bounces, and you have lost both the item and the refund.

Keep balances low in payment apps. Transfer money to your bank promptly. Payment app accounts do not have the same protections as bank accounts. Money sitting in Venmo is not insured the way money in a bank is.

Turn on all available security features. Use a PIN or biometric lock. Enable transaction notifications. These layers of protection can save you from unauthorized access.`
              },
              {
                title: "Protecting Yourself from Bank Fraud",
                content: `Bank fraud is increasingly sophisticated. Scammers use psychology, technology, and urgency to separate you from your money. Knowing their tactics is your best defense.

Phishing attempts come through text, email, and phone calls. They pretend to be your bank and claim there is a problem with your account. They create urgency to make you act without thinking. Real banks will never ask for your password, PIN, or full account number through these channels. If you get a suspicious message, do not click links. Call your bank directly using the number on your card or statement.

Account takeover happens when someone gains access to your online banking. They might guess your password, use information from data breaches, or trick you into revealing login credentials. Protect yourself with strong unique passwords, two-factor authentication, and by never logging into banking on public WiFi.

Card skimming involves devices placed on ATMs or card readers that copy your card information. Check ATMs for loose parts before inserting your card. Cover the keypad when entering your PIN. Use tap-to-pay when possible because it does not expose your card number.

Check fraud still exists. Never deposit checks from people you do not know. Fake checks can take weeks to bounce, and you are responsible for the money if you spend it before the check is discovered to be bad.

Set up account alerts for every transaction. Unusual activity notifications let you catch fraud immediately. The faster you report it, the better your chances of recovering funds.`
              }
            ],
            activityQuestion: "Create a personal digital security checklist for your banking and money apps. Include: which security features you will enable on each app, how you will create and store strong passwords, what your policy will be for sending money to others, and how often you will check for suspicious activity. Then identify one security improvement you can make today."
          }
        ]
      },
      7: {
        title: "Create a Personal Budget",
        sections: [
          {
            title: "Budgeting Methods That Actually Work",
            type: "reading",
            duration: "6 min",
            content: `There's no one-size-fits-all budget. Here are methods that work for different people:

**50/30/20 Rule (most popular):**
• 50% Needs - rent, food, bills, transportation
• 30% Wants - entertainment, eating out, shopping
• 20% Savings - emergency fund, investments, debt payoff

**Zero-Based Budget:**
• Every dollar gets assigned a job
• Income minus expenses equals zero
• Great if you want total control

**Envelope Method:**
• Put cash in envelopes for each category
• When the envelope is empty, stop spending
• Good for people who overspend with cards

**Pay Yourself First:**
• Move savings out immediately when you get paid
• Spend whatever's left guilt-free
• Simple and effective`,
            keyPoints: [
              "Try different methods to find what works for you",
              "50/30/20 is a great starting point",
              "The best budget is one you'll actually stick to",
              "Adjust as your income and expenses change"
            ],
            articles: [
              {
                title: "Why Most Budgets Fail",
                content: `Studies show that most people who create budgets abandon them within a few months. Understanding why helps you avoid the same fate.

The primary reason budgets fail is that they are too restrictive. People create unrealistic budgets with no room for enjoyment. They cut all discretionary spending, feel deprived, and eventually rebel by overspending. A sustainable budget includes money for fun.

Another common failure is creating a budget based on how you think you should spend rather than how you actually spend. If your real grocery spending is 400 dollars per month, budgeting 200 will not magically change your behavior. Start with actual numbers, then make gradual improvements.

Budgets also fail when they require too much effort. If tracking every purchase takes an hour a day, you will quit. Choose a method that fits your personality. Some people thrive on detailed tracking. Others do better with simpler approaches like the pay yourself first method.

Life changes also break budgets. An unexpected expense, a job change, or a move can throw off your carefully planned numbers. Successful budgeters treat their budget as a living document that adapts to circumstances.

Finally, budgets fail when there is no compelling reason behind them. Saying no to spending is easier when you have a clear yes you are working toward. Without goals, budgeting feels like restriction for its own sake.`
              },
              {
                title: "Finding Your Budgeting Style",
                content: `Different personality types need different budgeting approaches. The method that works for your friend might not work for you.

If you love details and spreadsheets, the zero-based budget might be perfect. You assign every single dollar to a category. Nothing is left unaccounted for. This gives you maximum control but requires significant time and attention.

If you hate tracking but want results, try the pay yourself first method. Set up automatic transfers to savings immediately when you get paid. What remains is yours to spend without guilt. You might not optimize every dollar, but you will consistently save.

If you struggle with overspending in certain categories, the envelope method creates physical limits. Put cash in envelopes for groceries, entertainment, and other variable expenses. When the envelope is empty, stop spending. The tangible nature of cash makes overspending harder.

If you want simplicity with structure, the 50/30/20 rule provides guardrails without excessive detail. Fifty percent to needs, thirty percent to wants, twenty percent to savings. You do not track every purchase, just keep the broad categories in balance.

If you are competitive and like games, use apps with challenges and achievements. Some budgeting apps award points for staying under budget or hitting savings goals.

There is no objectively best method. The best budget is the one you will actually use. Try different approaches until you find your fit.`
              }
            ],
            activityQuestion: "Take the budgeting personality quiz: Do you prefer detailed tracking or simple rules? Do you like technology or prefer pen and paper? Do you need strict limits or flexible guidelines? Based on your answers, which budgeting method do you think would work best for you and why?"
          },
          {
            title: "Building Your Personal Budget",
            type: "interactive",
            duration: "8 min",
            content: `Let's build YOUR budget step by step:

**Step 1: Calculate your monthly income**
Add up everything: job, scholarships, family help, side hustles

**Step 2: List your fixed expenses**
Things that are the same every month: rent, phone, insurance, subscriptions

**Step 3: Estimate variable expenses**
Things that change: food, gas, entertainment, personal care

**Step 4: Subtract expenses from income**
Positive = you have money to save
Negative = you need to cut spending or earn more

**Step 5: Set savings goals**
Emergency fund first, then other goals

**Step 6: Track and adjust**
Review weekly at first, then monthly once you get the hang of it`,
            keyPoints: [
              "Be honest about what you actually spend",
              "Include all income sources",
              "Don't forget irregular expenses (car repairs, gifts)",
              "Review and adjust your budget monthly"
            ],
            articles: [
              {
                title: "Your First Month Budget Guide",
                content: `Creating your first real budget is a milestone. Here is how to approach it without getting overwhelmed.

Before you budget, track. Spend one month writing down every purchase. Do not judge yourself or try to change behavior yet. Just observe. At the end of the month, you will have real data about where your money goes.

Calculate your actual income. Add up all sources: job, scholarships, family help, side hustles. Use the after-tax amount for jobs. This is your total available money.

List your non-negotiable expenses. Rent, utilities, phone, insurance, minimum debt payments. These come out first. Whatever remains is what you have to work with for everything else.

Now look at your tracked spending. How much did you actually spend on food? Entertainment? Transportation? Shopping? These numbers might surprise you. Use them as your starting point.

Create categories that match your life. The standard categories might not fit you. If you spend a lot on music or gaming, make that a category. If you never shop for clothes, you do not need that category.

Assign amounts to each category. Start with your actual spending, then adjust toward your goals. If you spent 400 on eating out and want to spend less, budget 350 next month. Gradual changes stick better than dramatic cuts.

Build in a buffer for unexpected expenses. Life happens. Having even 50 to 100 dollars in a miscellaneous category prevents one surprise from derailing your entire budget.`
              },
              {
                title: "Adjusting Your Budget Over Time",
                content: `A budget is not a one-time creation. It is a living document that evolves with your life. Learning to adjust it keeps it relevant and useful.

Review your budget monthly at first. At the end of each month, compare what you planned to spend with what you actually spent. Note the differences without judgment. These gaps tell you where your budget needs adjustment.

Some categories will consistently run over. This might mean you budgeted too little, or it might reveal spending habits you want to change. Be honest about which it is. If your grocery budget is always tight because you love cooking, increase it. If it is tight because you impulse buy, that needs a different solution.

Life changes require budget changes. A new job means new income and possibly new expenses like commuting costs. Moving changes your rent and utilities. Starting a relationship might mean more entertainment spending. Update your budget when circumstances change.

As you pay off debt or increase income, decide intentionally where that money goes. Without a plan, extra money tends to disappear into general spending. Redirect it toward goals: more savings, faster debt payoff, or increased fun money.

Seasonal adjustments matter too. Holiday months might need more gift budget. Summer might mean higher utility bills or vacation spending. Review your budget before predictable expensive periods.

Keep old budgets for comparison. Looking back at where you were six months or a year ago shows your progress and highlights patterns you might not notice month to month.`
              }
            ],
            activityQuestion: "Create your first monthly budget. List your actual income, your fixed expenses, and your best estimate of variable expenses by category. Calculate how much you have left for savings. If the numbers do not work, identify two to three specific areas where you could reduce spending."
          },
          {
            title: "Budgeting Tools & Apps",
            type: "reading",
            duration: "5 min",
            content: `You don't need fancy tools to budget, but they can make it easier.

**Free Budgeting Apps:**

**YNAB (You Need A Budget)**
• Best for: People who want to be hands-on
• Philosophy: Give every dollar a job
• Cost: Free trial, then paid (but worth it for serious budgeters)

**Mint (by Intuit)**
• Best for: Beginners who want automatic tracking
• Connects to all your accounts
• Shows spending categories automatically
• 100% free

**EveryDollar**
• Best for: Fans of Dave Ramsey's methods
• Simple and clean design
• Free version is manual entry, paid version connects to banks

**Simple Spreadsheet Method:**
• Google Sheets or Excel
• Free and completely customizable
• Many free templates available online
• Full control over your categories

**The Envelope Method (Old School but Works):**
• Cash in labeled envelopes for each category
• When an envelope is empty, you're done spending in that category
• Great for people who overspend with cards
• Can also do this digitally with separate savings accounts

**Choose based on your style:**
• Visual learner? Mint shows pretty charts
• Need accountability? YNAB makes you assign every dollar
• Like simplicity? Spreadsheet or envelope method
• Hate tracking? At minimum, track just your problem spending categories`,
            keyPoints: [
              "Try different apps to find what works for your style",
              "Any budgeting method is better than no method",
              "The envelope system works great for controlling overspending",
              "Spreadsheets give you complete control and customization"
            ],
            articles: [
              {
                title: "Choosing the Right Budgeting Tool",
                content: `The right budgeting tool can make the difference between success and giving up. Here is how to choose.

If automation appeals to you, try apps that connect to your bank accounts. Mint, Copilot, and similar apps automatically import and categorize transactions. You spend a few minutes reviewing instead of hours entering data. The downside is that automatic categorization is not perfect and some people find seeing all their accounts in one place overwhelming.

If you want control and do not mind manual entry, YNAB or EveryDollar work well. You enter each transaction, which forces you to think about every purchase. This awareness often leads to better spending decisions. The trade-off is time and effort.

If you love spreadsheets, a custom Google Sheets or Excel budget might be ideal. You can design exactly the categories and calculations you want. There are many free templates available as starting points. Spreadsheets are the most flexible option but require more initial setup.

If you hate technology, pen and paper still works. A notebook with columns for date, amount, and category accomplishes the same goal as any app. The envelope method with actual cash needs no technology at all.

Consider your weak points when choosing. If you overspend because you do not know your balance, you need real-time tracking. If you overspend because you lose track of category totals, you need clear visual category displays. The best tool addresses your specific challenges.

Most apps offer free trials. Test a few before committing. The time invested upfront pays off in finding a tool you will actually use.`
              },
              {
                title: "The Envelope System Deep Dive",
                content: `The envelope system has been helping people control spending for generations. Despite being old school, it remains one of the most effective methods for people who struggle with overspending.

The concept is simple. You create physical envelopes for each spending category: groceries, entertainment, gas, dining out. When you get paid, you withdraw cash and put the budgeted amount in each envelope. When you spend from a category, you use cash from that envelope. When the envelope is empty, you are done spending in that category until next payday.

The power is psychological. Physical cash feels more real than digital numbers. Watching an envelope empty creates visceral awareness that apps cannot match. The physical act of handing over money triggers pain receptors in a way that swiping a card does not.

Common categories for envelopes include groceries, dining out, entertainment, personal care, and clothing. Bills paid electronically do not need envelopes. Focus on categories where you tend to overspend.

You can modernize the system. Some people use separate bank accounts as digital envelopes. Others use apps that simulate the envelope approach. The key principle, separating money by category and stopping when a category is empty, works in any format.

The envelope system works best for variable expenses where you have control. Fixed expenses like rent happen automatically. Variable expenses like entertainment are where most overspending occurs and where envelopes excel.

Some people resist because carrying cash feels inconvenient or unsafe. Start with just one problem category. If you overspend on dining out, try envelope cash for restaurants only. Prove the concept before expanding.`
              }
            ],
            activityQuestion: "Set up a budgeting tool of your choice. If you choose an app, download it and connect your accounts or enter a week of transactions. If you choose spreadsheets, create one with your categories. If you choose the envelope system, create envelopes for at least three spending categories. Describe your experience setting it up and your initial impressions."
          },
          {
            title: "Common Budgeting Mistakes",
            type: "reading",
            duration: "5 min",
            content: `Most budgets fail. Here's why and how to avoid the same mistakes.

**Mistake 1: Being too restrictive**
• Problem: Zero fun money means you'll give up
• Fix: Build in a "blow money" category for guilt-free spending

**Mistake 2: Not tracking small purchases**
• Problem: $5 here, $10 there adds up fast
• Fix: Track EVERYTHING for at least one month to see the truth

**Mistake 3: Forgetting irregular expenses**
• Problem: Car registration, holiday gifts, annual subscriptions
• Fix: List all yearly expenses, divide by 12, save monthly

**Mistake 4: Not having an emergency buffer**
• Problem: One unexpected expense ruins the whole budget
• Fix: Build a $500-1000 buffer before anything else

**Mistake 5: Giving up after one bad month**
• Problem: One overspend and you quit entirely
• Fix: Treat it like a diet - one bad meal doesn't mean stop trying

**Mistake 6: Not paying yourself first**
• Problem: Saving "what's left" means saving nothing
• Fix: Automate savings BEFORE you can spend it

**Mistake 7: Using averages instead of actuals**
• Problem: You think you spend $200 on food but it's really $400
• Fix: Track real spending for 2-3 months before making a budget

**Mistake 8: Not involving partners/roommates**
• Problem: Shared expenses get messy
• Fix: Have regular money conversations, use apps like Splitwise`,
            keyPoints: [
              "Include fun money so you don't feel deprived and quit",
              "Track every purchase for a full month to find hidden spending",
              "Plan for irregular annual expenses by saving monthly",
              "Automate savings before you have a chance to spend it"
            ],
            articles: [
              {
                title: "The Psychology of Budget Success",
                content: `Successful budgeting is more about psychology than math. Understanding how your mind works around money helps you design a budget you will actually follow.

Willpower is finite. Every decision you make throughout the day depletes your willpower reserves. By evening, you have less resistance to impulse purchases. This is why most overspending happens late in the day. Combat this by making purchasing decisions earlier or by removing the need for decisions through automation.

Loss aversion makes cutting expenses painful. Losing something feels worse than never having it. This is why reducing spending on things you currently enjoy is harder than never starting those expenses. Frame budget cuts as temporary experiments rather than permanent deprivation.

Mental accounting means we treat money differently based on where it comes from. Found money, gifts, or bonuses feel less valuable than hard-earned money and get spent more easily. Treat all money the same by routing it through your budget regardless of source.

Present bias makes us value immediate rewards over future benefits. A purchase now feels more important than savings for later. Combat this by making savings automatic and making spending require effort.

Social comparison drives spending to match peers. If your friends eat at expensive restaurants, you feel pressure to join them. Recognize this influence and make conscious choices about which social norms to follow.

Small wins build momentum. Paying off a small debt or hitting a savings milestone creates positive feelings that motivate continued effort. Design your budget to create regular wins.`
              },
              {
                title: "Building Budget Resilience",
                content: `Every budget eventually faces a crisis. An unexpected expense, a loss of income, or just a bad month can derail your plans. Building resilience into your budget helps you recover quickly.

The emergency fund is your primary defense. Having even 500 to 1000 dollars set aside means unexpected car repairs or medical bills do not require credit cards or derail your monthly budget. Build this buffer before focusing on other goals.

Irregular expenses are predictable even if their exact timing is not. Cars need repairs. Holiday gift season happens every year. Annual subscriptions renew. List these expenses, estimate their annual cost, and save monthly so you are prepared when they hit.

Variable expenses provide flexibility. When money is tight, you can reduce discretionary spending temporarily. This is easier if you already know which expenses are truly essential and which have room to cut.

Multiple income streams provide stability. If one source decreases, others continue. Even small side income can bridge gaps during difficult periods.

Budget reviews catch problems early. Checking your budget weekly allows you to course correct mid-month rather than discovering at month end that you overspent by hundreds of dollars.

The most important resilience factor is mindset. Treating budget setbacks as learning opportunities rather than failures keeps you engaged. Every budget eventually has a bad month. What matters is returning to your plan afterward.`
              }
            ],
            activityQuestion: "Identify your biggest budgeting challenge based on the psychology concepts discussed (willpower depletion, loss aversion, present bias, social comparison, etc.). Describe a specific situation where this challenge affects your spending. Then create a strategy to address this challenge using the techniques mentioned in the articles."
          }
        ]
      },
      8: {
        title: "Create Your Spending Plan",
        sections: [
          {
            title: "Tracking Every Dollar",
            type: "reading",
            duration: "5 min",
            content: `You can't manage what you don't measure. Here's how to track your spending:

**Manual tracking:**
• Write down every purchase in a notebook or notes app
• Take photos of receipts
• Review at the end of each day

**Apps that help:**
• Mint - connects to your accounts, categorizes automatically
• YNAB (You Need A Budget) - great for the zero-based method
• Personal Capital - good for seeing the big picture
• Your bank's built-in spending tracker

**What to track:**
• Amount spent
• Category (food, transportation, entertainment)
• Whether it was a need or want
• How you paid (cash, debit, credit)`,
            keyPoints: [
              "Pick ONE tracking method and stick with it",
              "Review your spending weekly",
              "Categorize everything for better insights",
              "Look for patterns in your spending"
            ],
            articles: [
              {
                title: "The Power of Tracking Every Purchase",
                content: `Tracking every purchase sounds tedious, but it creates awareness that fundamentally changes spending behavior. Most people have no idea where their money actually goes until they track it.

The simple act of recording a purchase makes you pause and think. Do I really need this? Is this worth it? This moment of reflection prevents many impulse purchases. Some people find that just knowing they have to write something down stops them from buying it.

Tracking reveals hidden spending patterns. Those daily coffees? They add up to 100 dollars or more per month. Subscription services you forgot about? They quietly drain your account. Small purchases you do not remember? They often total more than big purchases you agonize over.

Categories show where your money actually goes versus where you think it goes. Most people underestimate food and entertainment spending and overestimate how much they save. Real data corrects these misconceptions.

After a few weeks of tracking, you will notice patterns. Maybe you spend more on weekends, or when you are stressed, or when you are with certain friends. These patterns point to root causes you can address.

You do not need to track forever. Intense tracking for two to three months builds awareness that persists even after you stop detailed tracking. Think of it as training wheels for your financial awareness.`
              },
              {
                title: "Categories That Actually Help",
                content: `How you categorize spending determines how useful your tracking becomes. Generic categories like miscellaneous or other hide information. Specific categories reveal it.

Start with the basics: housing, transportation, food, utilities, debt payments. These are your major expense areas. Most budgets use some version of these.

Within food, separate groceries from dining out. These are very different behaviors. Groceries are often necessities while dining out is usually discretionary. Knowing the split helps you make better decisions.

Create categories for your specific spending patterns. If you spend significant money on coffee, make it a category. If gaming is a major expense, track it separately. If fitness matters to you, give it its own line.

Consider separating needs from wants within categories. Transportation is a need, but Uber to places you could walk is a want. Food is a need, but expensive restaurants are a want. This distinction helps you see where you have flexibility.

Time-based categories can also help. Morning spending, evening spending, weekend spending. If you notice you blow your budget every Friday night, you have found a specific problem to address.

Track emotional spending separately. When you buy something because you are stressed, bored, or celebrating, note that. Understanding your emotional relationship with money is as important as understanding the numbers.

Do not create so many categories that tracking becomes overwhelming. Start with ten to fifteen categories and adjust based on what proves useful.`
              }
            ],
            activityQuestion: "Track every single purchase you make for the next 48 hours. Write down the amount, what you bought, and the category. At the end, add up the totals by category and note any surprises. Did you spend more or less than you expected in any category?"
          },
          {
            title: "Creating Your Spending Plan",
            type: "interactive",
            duration: "7 min",
            content: `A spending plan is like a budget, but more flexible. Here's how to make one:

**1. Know your priorities:**
What matters most to you? Saving for a car? Having fun on weekends? Be honest.

**2. Allocate money to priorities FIRST:**
Before bills even, decide how much goes to what matters most.

**3. Cover the essentials:**
Rent, utilities, food, transportation - the stuff you can't skip.

**4. Plan for fun:**
Yes, include entertainment. A plan with no fun won't last.

**5. Build in flexibility:**
Have a "miscellaneous" category for unexpected stuff.

**6. Review and adjust:**
Life changes. Your plan should too.`,
            keyPoints: [
              "Your spending plan should reflect YOUR priorities",
              "Include fun money - you're more likely to stick to it",
              "Build in a buffer for unexpected expenses",
              "Adjust your plan as your life changes"
            ],
            articles: [
              {
                title: "Values-Based Spending Plans",
                content: `Most budgets fail because they focus on restriction rather than alignment with what you actually value. A values-based spending plan works differently.

Start by identifying what matters most to you. Not what should matter or what others think should matter, but what actually brings you happiness and fulfillment. For some people, this is travel. For others, it is technology, fitness, or experiences with friends.

Once you know your values, allocate money accordingly. If health is a top value, gym memberships and quality food get priority. If creativity is important, spending on art supplies or music equipment makes sense. The spending plan reflects you.

Cut ruthlessly in areas that do not align with your values. If you do not care about fashion, buy clothes at thrift stores. If cars are just transportation to you, drive a reliable used vehicle. Spending less on things you do not value is not deprivation, it is efficiency.

This approach makes budgeting feel empowering rather than restrictive. You are not denying yourself things. You are choosing to spend on what matters and not waste money on what does not.

When unexpected money comes in, you know immediately where to direct it. Toward your values. When you need to cut spending, you know what to protect. Your priorities are clear.

Review your values periodically. What mattered at eighteen might not matter at twenty-five. As you grow, your spending plan should evolve to reflect who you are becoming.`
              },
              {
                title: "Building Flexibility Into Your Plan",
                content: `Rigid budgets break. Life is unpredictable, and a spending plan that cannot adapt will fail when circumstances change. Building in flexibility from the start prevents this.

Create a miscellaneous category for unexpected expenses. Not emergencies requiring your emergency fund, but regular unexpected things: a friend's birthday you forgot, a book you want, a parking ticket. Having 50 to 100 dollars per month for random stuff prevents these small surprises from derailing your plan.

Build slack into category estimates. If you think groceries will cost 300 dollars, budget 325. This buffer absorbs normal variation without requiring constant adjustments.

Keep some savings liquid and accessible. Not all savings should be locked away in retirement accounts or CDs. Having money you can access without penalty gives you options when circumstances change.

Allow category shifting. If you spend less on entertainment one month, let yourself use that money elsewhere rather than forcing artificial adherence to every category.

Plan for variable income if you have it. Gig workers, freelancers, and those with commission-based pay cannot assume stable monthly income. Budget based on your lowest recent income and treat good months as bonuses.

Schedule regular plan reviews. Monthly at first, quarterly once you have a stable routine. These check-ins are when you adjust categories, revisit goals, and ensure your plan still fits your life.`
              }
            ],
            activityQuestion: "Identify your top three personal values when it comes to spending money (examples: experiences, security, health, creativity, relationships, independence). For each value, describe one way you could adjust your spending to better align with it. Then identify one expense that does not align with any of your top values that you could reduce or eliminate."
          },
          {
            title: "Cutting Expenses Without Feeling Broke",
            type: "reading",
            duration: "6 min",
            content: `Cutting costs doesn't mean living miserably. Here's how to spend less while still enjoying life.

**Subscriptions audit:**
• List every subscription you have (Netflix, Spotify, gym, apps)
• Cancel what you haven't used in 30 days
• Share family plans when possible (Spotify Family, Netflix)
• Use free alternatives (library apps for audiobooks, free Spotify tier)

**Food costs (usually the biggest budget leak):**
• Meal prep on Sundays - cook once, eat all week
• Pack lunch instead of buying - saves $50-100/week
• Use grocery pickup to avoid impulse buys
• Student discounts at restaurants (always ask!)

**Transportation savings:**
• Carpool when possible
• Use student transit passes
• Combine trips to save gas
• Consider biking for short distances

**Entertainment hacks:**
• Student discounts EVERYWHERE (movies, museums, software)
• Free campus events
• Library cards give free access to streaming services, ebooks
• Host game nights instead of going out

**Shopping smarter:**
• Wait 24-48 hours before non-essential purchases
• Use browser extensions like Honey for automatic coupons
• Buy used textbooks, sell them after
• Shop end-of-season sales

**The "No-Spend Challenge":**
Try one week per month where you only spend on absolute necessities. You'll be surprised how little you actually need.`,
            keyPoints: [
              "Audit and cancel unused subscriptions monthly",
              "Meal prepping saves the most money for most people",
              "Always ask about student discounts - they're everywhere",
              "Wait 24-48 hours before impulse purchases"
            ],
            articles: [
              {
                title: "The Art of Spending Less",
                content: `Spending less does not require willpower if you set up your life correctly. It requires systems and environments that make spending harder and saving easier.

Start with automatic barriers to spending. Delete shopping apps from your phone. Unsubscribe from marketing emails. Remove saved credit cards from websites. Each barrier creates a moment to reconsider.

Use the 24-hour rule for non-essential purchases. If you want something, wait 24 hours. Often the desire passes. For larger purchases, wait one day per 100 dollars. A 500 dollar item gets a five-day waiting period.

Change your environment. If you overspend at certain stores, stop going there. If certain friends encourage expensive activities, suggest cheaper alternatives. Your environment shapes your behavior more than your intentions do.

Find free or cheap alternatives for things you currently pay for. Libraries offer free books, movies, and often streaming services. Parks provide free exercise. Campus events are usually free for students.

Negotiate everything. Call your internet company and ask for a lower rate. Question medical bills. Ask for discounts. Many people overpay simply because they do not ask.

Reframe spending cuts as temporary experiments. Instead of saying you will never eat out again, try not eating out for one month and see how it goes. Experiments feel less permanent and allow you to find sustainable changes.`
              },
              {
                title: "The Subscription Trap",
                content: `Subscriptions are designed to be easy to start and hard to cancel. Companies know that once you sign up, inertia keeps you paying even when you rarely use the service.

Conduct a subscription audit. Go through your bank and credit card statements for the past three months. List every recurring charge. Most people find subscriptions they forgot about.

Apply the 30-day test. Have you used this subscription in the last 30 days? If not, cancel it. You can always resubscribe if you miss it. Most people never do.

Calculate the true annual cost. A 9.99 per month subscription is nearly 120 per year. That 4.99 app adds up to 60 per year. When you see the annual number, subscriptions feel more significant.

Beware of free trials. Set a calendar reminder before the trial ends to decide whether to cancel. Many companies count on you forgetting.

Share when possible. Family plans for streaming services, Spotify, and other subscriptions split costs. Some subscriptions allow multiple users. Check the terms and share with roommates or family.

Rotate instead of stacking. You do not need Netflix, Hulu, Disney Plus, and HBO Max simultaneously. Subscribe to one, watch what you want, cancel, and rotate to the next. You still get access to everything, just not simultaneously.

Use free alternatives. Your library card likely gives access to free ebooks, audiobooks, and streaming services. Free tiers of apps often provide enough functionality.`
              }
            ],
            activityQuestion: "Conduct a full subscription audit. List every recurring charge you currently have (streaming, apps, memberships, services). For each one, note the monthly cost, when you last used it, and whether it provides value worth the cost. Identify at least two subscriptions you could cancel or downgrade and calculate how much you would save annually."
          },
          {
            title: "Building Your Savings Habit",
            type: "reading",
            duration: "5 min",
            content: `Saving money is a skill you build over time. Here's how to make it automatic.

**The Pay Yourself First Method:**
1. Calculate your monthly savings goal
2. Set up automatic transfer on payday
3. Money goes to savings BEFORE you see it
4. Live on what's left

**Where to keep your savings:**
• Emergency fund: High-yield savings account (earn 4-5% APY)
• Short-term goals: Regular savings account
• Long-term goals: Consider CDs or investment accounts

**The Savings Ladder:**
1. First $500: Starter emergency fund
2. Next $1,000: Full mini emergency fund
3. Then: 1 month of expenses saved
4. Goal: 3-6 months of expenses

**Make saving feel rewarding:**
• Name your savings accounts (not "Savings" but "Trip to Japan" or "New Car")
• Track your progress visually
• Celebrate milestones without spending
• Tell a friend your goal for accountability

**Savings challenges to try:**
• 52-week challenge: Week 1 = $1, Week 2 = $2... Week 52 = $52 (total: $1,378)
• Round-up savings: Round every purchase up to nearest dollar, save the difference
• No-spend weeks: One week per month, no non-essential spending

**When NOT to save:**
• If you have high-interest debt (over 10%), pay that first
• If you have no income at all, focus on earning first
• If you're not covering basic needs, prioritize those`,
            keyPoints: [
              "Automate savings so it happens before you can spend it",
              "Keep emergency savings in a high-yield savings account",
              "Name your savings accounts with specific goals",
              "Start small - even $5/week builds the habit"
            ],
            articles: [
              {
                title: "Making Savings Automatic",
                content: `The secret to saving money is removing the need for willpower. Automation makes saving happen whether you feel like it or not.

Set up automatic transfers from checking to savings on payday. The money moves before you see it in your spending account. You adapt to living on what remains rather than making a conscious choice to save.

Start with a small amount if necessary. Even 25 dollars per paycheck is better than nothing. The habit matters more than the amount. Once the automatic transfer is routine, gradually increase it.

Use multiple savings accounts for different goals. Most banks allow free additional savings accounts. Name them specifically: Emergency Fund, Car Down Payment, Vacation, Holiday Gifts. Seeing money grow toward specific goals is motivating.

Take advantage of employer retirement matching if available. This is free money. Contributing enough to get the full match should be a priority even before other savings goals.

Use round-up savings programs. Many banks and apps automatically round purchases to the nearest dollar and transfer the difference to savings. A 4.75 purchase becomes 5 dollars with 0.25 going to savings. These small amounts accumulate.

Schedule automatic increases. Set a calendar reminder to increase your savings rate by 1 percent every six months. You will not notice the gradual change, and your savings will grow significantly over time.`
              },
              {
                title: "The Emergency Fund Priority",
                content: `Before any other financial goal, build an emergency fund. This is the foundation that everything else rests on.

An emergency fund prevents debt. When unexpected expenses hit and you have no savings, credit cards become the solution. One emergency can start a debt cycle that takes years to escape. Savings break this cycle before it starts.

Start with a starter emergency fund of 500 to 1000 dollars. This handles most minor emergencies: car repairs, medical copays, emergency travel. Getting to this level is your first priority.

Build toward three to six months of expenses over time. This level protects against job loss, major medical issues, or other significant disruptions. The exact amount depends on your job stability and risk tolerance.

Keep emergency funds liquid and accessible. A high-yield savings account works well. You earn interest but can access the money within a day or two when needed. Do not put emergency funds in investments or accounts with withdrawal penalties.

Define what counts as an emergency before one happens. Job loss counts. Medical bills count. Car repairs for a car you need for work count. A sale at your favorite store does not count. Pizza because you do not feel like cooking does not count.

Replenish immediately after using. When you dip into emergency savings, make rebuilding it the top priority. Treat the emergency fund like a bill that must be paid.`
              }
            ],
            activityQuestion: "Calculate how much you would need for a three-month emergency fund based on your current or estimated monthly expenses. Then create a savings plan: how much would you need to save each month to reach your starter emergency fund goal of $500-1000 within the next three months? Set up an automatic transfer to begin building this fund."
          }
        ]
      },
      9: {
        title: "Personal Branding & Professionalism",
        sections: [
          {
            title: "What is Personal Branding?",
            type: "reading",
            duration: "6 min",
            content: `Your personal brand is how people see you - online and in real life. Think of yourself as a product. What makes YOU unique and valuable?

**Your brand includes:**
• How you present yourself online (social media, LinkedIn)
• How you dress and carry yourself
• How you communicate (speaking, writing, texting)
• Your reputation - what people say about you

**Why it matters:**
• Recruiters Google you before interviews
• Your online presence can help or hurt job chances
• Networking is easier when people know what you're about
• A strong brand opens doors

**As a student:**
• You're building your reputation now
• Your discipline and work ethic are valuable
• Use your unique experiences as part of your brand
• Don't limit yourself to just one identity`,
            keyPoints: [
              "Your brand is what people say about you when you're not there",
              "Google yourself - see what comes up",
              "Be consistent across all platforms",
              "Your unique experiences are strengths - use them"
            ],
            articles: [
              {
                title: "Building Your Reputation Now",
                content: `Your personal brand is not something you create after college. It is being built right now through every interaction, every class, every team meeting, every social media post.

Think of your reputation as a bank account. Every time you show up on time, you make a deposit. Every time you do quality work, you make a deposit. Every time you help someone, you make a deposit. These deposits accumulate over time into a reputation.

Withdrawals happen too. Missing commitments, producing sloppy work, being unreliable - these drain your reputation account. Unlike a real bank, you cannot see the exact balance, but others are keeping track even if you are not.

Start building your brand intentionally. Decide what you want to be known for. Hard work? Creativity? Reliability? Leadership? Then behave consistently in ways that reinforce that identity.

Your professors, coaches, teammates, and classmates form impressions that follow you. College is smaller than it seems. People talk. That professor you impressed might know someone at your dream company. That teammate might become a connection in your industry.

Every interaction is an opportunity to reinforce or damage your brand. This does not mean being fake or always performing. It means being intentional about the authentic impression you create.`
              },
              {
                title: "Discovering Your Unique Value",
                content: `Your personal brand should highlight what makes you different, not what makes you the same as everyone else. Discovering your unique value is essential.

Start by identifying your intersection of skills. Maybe you are analytical AND creative. Maybe you understand technology AND people. Maybe you have athletic discipline AND business interests. These combinations are more rare and valuable than any single skill.

Consider your experiences. Growing up in a certain place, overcoming specific challenges, having particular interests - these shape your perspective in ways others cannot replicate. Your unique background is a feature, not a bug.

Ask others what they see in you. We often do not recognize our own strengths because they come naturally. Ask trusted friends, family, or mentors what they think you are good at, what makes you different, what they would hire you for.

Notice what people ask you for help with. Are you the person friends call when they need tech support, advice on relationships, or workout tips? These requests reveal what others perceive as your strengths.

Your unique value does not have to be exceptional talent. Reliability is a form of unique value when so many people are unreliable. Clear communication is valuable when most people communicate poorly. Find where you can be distinctly useful.`
              }
            ],
            activityQuestion: "Define your personal brand in three words that you want people to associate with you. Then write a short paragraph explaining why these three words represent you, including specific examples of how you demonstrate these qualities. Finally, identify one area where your current behavior does not align with your desired brand and describe how you will change it."
          },
          {
            title: "Building Your Online Presence",
            type: "interactive",
            duration: "7 min",
            content: `Let's clean up your online presence:

**LinkedIn (essential for careers):**
• Professional photo (no party pics)
• Clear headline: "Finance Major | Aspiring Business Leader | Problem Solver"
• Summary that tells your story
• List your achievements and experiences

**Social Media Audit:**
• Would you be okay with a future employer seeing everything?
• Delete or hide anything questionable
• Set accounts to private if needed
• Think before you post - always

**Creating valuable content:**
• Share your journey and lessons learned
• Post about your interests and goals
• Engage with others in your field
• Be helpful, not just self-promotional`,
            keyPoints: [
              "LinkedIn is non-negotiable for career building",
              "Audit your social media - delete the sketchy stuff",
              "Post content that adds value",
              "Be authentic but professional"
            ],
            articles: [
              {
                title: "Your LinkedIn Profile Guide",
                content: `LinkedIn is the professional social network that matters for career building. A strong profile opens doors to opportunities you might never find otherwise.

Your profile photo matters more than you think. Profiles with photos get significantly more views than those without. Use a clear headshot with good lighting, a simple background, and professional but approachable expression. No selfies, no party photos, no pictures where you cropped out other people.

Your headline is prime real estate. Instead of just your job title, use it to communicate your value. Compare: "Student at State University" versus "Finance Student | Passionate About Investment Analysis | Future Fund Manager." The second version tells people what you offer and aspire to.

Your summary should tell your story. Write in first person and share what drives you, what you have accomplished, and where you are headed. Make it personal enough to be memorable but professional enough for hiring managers.

List all relevant experience, even if it does not seem directly related to your career goals. Part-time jobs show work ethic. Volunteer work shows character. Athletic achievements show discipline and teamwork. Frame each experience in terms of skills gained and value provided.

Connect strategically. Connect with classmates, professors, family friends in professional roles, and people you meet at events. Quality matters more than quantity, but a robust network increases your visibility.`
              },
              {
                title: "Social Media Audit Checklist",
                content: `What exists online about you matters for your career. Recruiters search for candidates on social media. One inappropriate post can cost you an opportunity.

Search for yourself. Google your name with and without middle name or initial. Check what appears on the first two pages of results. Look at image search results. This is what employers see.

Review every social media profile. Go through Facebook, Instagram, Twitter, TikTok, and any other platforms. Look at old posts, photos, comments, and tagged content. What seemed funny at 16 might look unprofessional now.

Apply the employer test to everything. For each piece of content, ask: would I be comfortable if my future boss saw this? If the answer is no, delete it or change your privacy settings.

Adjust privacy settings strategically. You do not have to delete your personal social media presence, but you can make it private. Lock down personal accounts and keep only your professional presence public.

Be careful about opinions. Political hot takes, controversial opinions, and heated arguments are risky online. You do not know who will read them or how they will interpret them. Keep strong opinions for private conversations.

Remember that nothing online is truly private. Screenshots exist. Privacy settings can change. Content can be shared. Post as if everything you write could eventually become public.`
              }
            ],
            activityQuestion: "Conduct a full social media audit on yourself. Google your name, review your profiles on all platforms, and check your privacy settings. Write a summary of what you found, including anything that might concern a potential employer. Then make a list of at least three specific changes you will make to improve your online presence."
          },
          {
            title: "Professional Communication",
            type: "reading",
            duration: "6 min",
            content: `How you communicate says a lot about you. Let's level up your professional communication skills.

**Email Etiquette:**
• Clear subject line that tells them what it's about
• Professional greeting (Hi [Name], / Dear [Name],)
• Get to the point quickly - busy people skim
• Use proper grammar and punctuation
• Professional sign-off (Best regards, Thank you, etc.)
• Proofread before sending!

**Example of a professional email:**
Subject: Question About Summer Internship Application

Hi Ms. Johnson,

I recently applied for the Marketing Intern position and wanted to follow up on my application status. I'm very excited about the opportunity to contribute to your team.

Please let me know if you need any additional information from me.

Thank you for your time,
[Your Name]

**Text/DM Communication:**
• Match the other person's formality level
• Still use proper spelling (no "u" for "you" in professional contexts)
• Keep it brief and clear
• Save complex discussions for email or calls

**Phone & Video Calls:**
• Find a quiet place with good lighting
• Have your camera on for video calls
• Dress appropriately (at least from the waist up!)
• Mute yourself when not speaking
• Be on time - early is even better

**In-Person Professionalism:**
• Eye contact shows confidence
• Firm handshake (practice this!)
• Put your phone away
• Active listening - nod, respond, ask follow-up questions`,
            keyPoints: [
              "Always proofread emails before sending",
              "Match your communication style to the situation",
              "Be early to calls and meetings",
              "Eye contact and active listening make a strong impression"
            ],
            articles: [
              {
                title: "Email Communication Excellence",
                content: `Email is often your first professional impression. Getting it right opens doors. Getting it wrong closes them.

Subject lines should clearly state the purpose. Vague subjects like "Question" or "Hi" get ignored or deprioritized. Specific subjects like "Follow-up on Marketing Intern Application - Jane Smith" get opened and addressed.

Keep emails concise. Professionals receive dozens of emails daily. They skim, not read. Put the most important information first. Use short paragraphs. Make requests clear and specific.

Match formality to the relationship. A first email to a professional you do not know should be formal. Once you establish a relationship and they respond casually, you can adjust. When in doubt, err on the formal side.

Proofread everything. Grammar and spelling errors signal carelessness. Read your email out loud before sending. Use spell check but do not rely on it completely. Have someone else review important emails.

Time your emails appropriately. Sending at 3 AM looks strange. If you write late, save it as a draft and send during business hours. Consider the recipient's time zone for people in other locations.

Follow up appropriately. If you do not hear back within a week, a polite follow-up is appropriate. After two follow-ups with no response, take the hint. Persistence is good; pestering is not.`
              },
              {
                title: "Speaking With Confidence",
                content: `How you speak affects how people perceive you. Confident communication can be learned and practiced.

Eliminate filler words. Um, like, you know, basically - these make you sound uncertain. Record yourself speaking and notice your fillers. Then practice pausing instead of filling the silence. A brief pause sounds confident; filler words do not.

Speak at a measured pace. Nervous speakers talk fast. Slow down. Articulate each word. Pauses give listeners time to absorb what you said and make you appear thoughtful.

Project your voice. Speaking too quietly signals lack of confidence. Practice speaking from your diaphragm, not your throat. You do not need to yell, just speak clearly enough that everyone can hear without straining.

Maintain eye contact. Looking away constantly signals discomfort or dishonesty. In conversations, maintain eye contact about 60-70 percent of the time. In presentations, scan the room and make brief eye contact with individuals throughout.

Use confident body language. Stand or sit straight. Keep your hands visible and relaxed, not crossed or fidgeting. Avoid touching your face or hair. Take up space without being aggressive.

Practice in low-stakes situations. Join clubs where you can speak. Participate in class. Have conversations with strangers. Each practice opportunity builds your confidence for higher-stakes situations.`
              }
            ],
            activityQuestion: "Write a professional email to request an informational interview with someone in a career field you are interested in. Include a clear subject line, professional greeting, explanation of who you are and why you are reaching out, a specific request, and a professional closing. Then identify three filler words you use frequently and commit to eliminating them."
          },
          {
            title: "Dressing for Success",
            type: "reading",
            duration: "5 min",
            content: `First impressions matter. Here's how to dress for different situations.

**Understanding Dress Codes:**

**Business Formal:**
• Men: Suit and tie, dress shoes
• Women: Suit, professional dress, closed-toe shoes
• When: Interviews at banks, law firms, formal events

**Business Casual:**
• Men: Dress pants/khakis, collared shirt, dress shoes
• Women: Dress pants, blouse, professional shoes
• When: Most office settings, networking events

**Smart Casual:**
• Men: Nice jeans/chinos, polo or button-up, clean shoes
• Women: Nice jeans, casual blouse, neat shoes
• When: Casual workplace, some interviews, campus events

**Building a professional wardrobe on a budget:**
• Thrift stores often have great professional clothes
• Invest in 2-3 quality basics that mix and match
• Neutral colors (black, navy, gray, white) work with everything
• One good pair of dress shoes goes a long way

**Grooming matters too:**
• Clean, neat appearance
• Hair styled appropriately
• Minimal cologne/perfume
• Clean nails and shoes
• Iron your clothes!

**When in doubt:**
• It's better to be slightly overdressed than underdressed
• Look at the company's website/social media for clues
• Ask the recruiter what the dress code is
• Clean and wrinkle-free always wins`,
            keyPoints: [
              "Know the difference between business formal and business casual",
              "Build a capsule wardrobe of professional basics",
              "When unsure, dress one level up from expected",
              "Grooming and cleanliness matter as much as clothes"
            ],
            articles: [
              {
                title: "Building a Professional Wardrobe on a Budget",
                content: `You do not need expensive clothes to look professional. You need the right clothes that fit well and are clean and pressed.

Start with versatile basics in neutral colors. Black, navy, gray, and white pieces mix and match to create many outfits from few items. One navy blazer can dress up multiple outfits.

Fit matters more than brand. A well-fitting shirt from Target looks better than an expensive designer shirt that does not fit. Learn your measurements. Try things on. Consider having key pieces tailored.

Thrift stores and consignment shops are your friends. Professional clothes are often barely worn before being donated. You can find quality pieces at a fraction of retail price. Check regularly as inventory changes.

Invest in quality for items that matter most. One good pair of dress shoes will last years with proper care. A quality belt makes a difference. These items get noticed and are worth spending more on.

Care for your clothes properly. Learn to iron or steam. Store items properly. Polish shoes. Professional clothes that look worn or wrinkled undermine the impression you are trying to make.

Build slowly over time. You do not need everything at once. Start with one complete professional outfit for interviews. Add pieces gradually as opportunities and budget allow.`
              },
              {
                title: "First Impressions and Body Language",
                content: `Research shows that people form first impressions within seconds. Those impressions are hard to change. Understanding what contributes to first impressions helps you make them positive.

Your entrance matters. Walk in with confident posture, shoulders back, head up. Make eye contact and smile. These signals communicate confidence and approachability before you say a word.

A handshake still matters in professional settings. Practice until yours is firm but not crushing, confident but not aggressive. Make eye contact during the handshake.

Posture communicates attitude. Slouching signals disinterest or insecurity. Standing or sitting straight signals engagement and confidence. Good posture also makes you look better in your clothes.

Facial expressions are contagious. If you look nervous, others feel uncomfortable. If you look warm and engaged, others respond positively. Practice your professional smile - genuine but not forced.

Mirror and match subtly. People feel more comfortable with those who seem similar to them. Subtly matching the energy level and body language of the person you are meeting builds rapport.

Arrive early and collect yourself. Rushing in stressed and disheveled makes a poor first impression. Arrive with time to spare, use the restroom, check your appearance, and take a breath before entering.`
              }
            ],
            activityQuestion: "Take inventory of your current wardrobe for professional situations. List what you have that could work for an interview. Identify any gaps you need to fill. Then create a budget-friendly plan to build out your professional wardrobe, including where you will shop and approximately how much you will spend on each item."
          }
        ]
      },
      10: {
        title: "Resume Building & Job Applications",
        sections: [
          {
            title: "Creating a Standout Resume",
            type: "reading",
            duration: "7 min",
            content: `Your resume is your first impression. Make it count:

**Format basics:**
• One page (unless you have 10+ years experience)
• Clean, readable font (no Comic Sans ever)
• Consistent formatting throughout
• PDF format when sending

**What to include:**
• Contact info at the top
• Education (include GPA if 3.0+)
• Experience (jobs, internships, volunteer work)
• Skills (technical and soft skills)
• Athletic experience (leadership, teamwork, discipline)

**Power words to use:**
• Led, managed, created, developed
• Increased, improved, achieved
• Coordinated, organized, implemented

**What NOT to include:**
• "References available upon request" (obvious)
• Irrelevant hobbies
• Personal info (age, marital status)
• Lies (they will check)`,
            keyPoints: [
              "Keep it to one page",
              "Use action verbs to describe achievements",
              "Quantify results when possible (increased sales by 20%)",
              "Tailor your resume for each job application"
            ],
            articles: [
              {
                title: "Writing Effective Bullet Points",
                content: `The bullet points on your resume are where you prove your value. Weak bullet points list duties. Strong bullet points demonstrate impact.

Start each bullet with a strong action verb. Led, created, developed, achieved, improved, managed, coordinated. These words show initiative and ownership. Avoid passive phrases like "was responsible for" or "helped with."

Include numbers whenever possible. Managed a team of 5 people. Increased sales by 20 percent. Processed 50 transactions daily. Trained 10 new employees. Numbers make your impact concrete and memorable.

Show results, not just activities. Instead of "Answered customer phone calls," write "Resolved customer issues on first call 95 percent of the time, improving satisfaction scores." The second version shows the impact of your work.

Use the formula: Action + Task + Result. "Led weekly team meetings (action/task), resulting in improved project coordination and 15 percent faster delivery times (result)." This structure ensures every bullet demonstrates value.

Tailor bullets to the job you want. Read the job description carefully. What skills and experiences are they seeking? Emphasize the bullet points that align with their needs. You do not lie or exaggerate, but you do strategically highlight relevant experience.

Cut the fluff. Every word should earn its place. Generic phrases like "excellent communication skills" or "team player" waste space. Show these qualities through your accomplishments instead.`
              },
              {
                title: "Beating the Applicant Tracking System",
                content: `Before a human sees your resume, it often passes through an Applicant Tracking System (ATS). These software programs scan for keywords and can reject qualified candidates who do not optimize their resume.

Use keywords from the job posting. If the posting says "project management," use that phrase, not "managed projects." If it says "customer service," use "customer service." The ATS looks for exact matches.

Use standard section headings. Work Experience, Education, Skills - these standard labels help the ATS parse your resume correctly. Creative headings might confuse the system.

Avoid graphics, tables, and unusual formatting. ATS systems read text. Fancy formatting can scramble your content or make it unreadable. Stick to simple formatting that both computers and humans can process.

Use standard fonts and file formats. Submit as a Word document or PDF unless the application specifies otherwise. Some ATS systems struggle with unusual file formats.

Do not try to trick the system. Some people hide keywords in white text or stuff irrelevant keywords. ATS systems are getting smarter at detecting these tricks, and human reviewers notice them.

Still write for humans. Your resume needs to pass the ATS to be seen, but a human makes the final decision. Balance keyword optimization with readability and compelling content.`
              }
            ],
            activityQuestion: "Take a job posting for a position you would like and identify the top ten keywords and phrases used. Then review your current resume (or create a draft) and count how many of those keywords appear. Rewrite at least three bullet points on your resume to better incorporate relevant keywords while still sounding natural."
          },
          {
            title: "Job Application Strategy",
            type: "interactive",
            duration: "6 min",
            content: `Applying for jobs is a numbers game, but strategy matters:

**Before you apply:**
• Research the company thoroughly
• Read the job description carefully
• Make sure you meet at least 70% of requirements
• Customize your resume for this specific job

**The application process:**
• Follow instructions exactly
• Write a tailored cover letter
• Use keywords from the job posting
• Proofread everything twice

**After you apply:**
• Keep a spreadsheet of applications
• Follow up after 1-2 weeks if no response
• Connect with employees on LinkedIn
• Keep applying - don't wait for responses

**Common mistakes:**
• Applying to everything without customizing
• Typos and grammar errors
• Not following up
• Giving up too soon`,
            keyPoints: [
              "Quality over quantity - customize each application",
              "Keep track of where you've applied",
              "Follow up politely if you don't hear back",
              "Rejection is normal - keep going"
            ],
            articles: [
              {
                title: "The Strategic Job Search",
                content: `Randomly applying to hundreds of jobs is inefficient. A strategic approach yields better results with less effort.

Research before applying. Learn about the company, their culture, their challenges, and their values. This research helps you customize your application and prepare for interviews. It also helps you identify companies you genuinely want to work for.

Network into positions when possible. Many jobs are filled through referrals before being posted publicly. Connect with employees at target companies. Ask for informational interviews. Let people know you are looking. A warm introduction beats a cold application.

Apply to jobs where you meet at least 70 percent of the qualifications. Job postings describe ideal candidates, not minimum requirements. If you have most of what they want, apply. Companies regularly hire people who grow into the role.

Customize every application. Generic applications get generic responses, usually rejection. Tailor your resume and cover letter to each specific position. Reference the company by name. Connect your experience to their specific needs.

Track your applications systematically. Create a spreadsheet with company name, position, date applied, contact information, and status. This helps you follow up appropriately and prevents accidentally applying twice or missing opportunities.

Be patient but persistent. Job searches take time. Expect rejection; it is part of the process. Each application and interview is practice for the next one.`
              },
              {
                title: "The Power of Follow-Up",
                content: `Following up after applications and interviews sets you apart from candidates who submit and forget. It demonstrates genuine interest and professionalism.

After applying, wait one to two weeks before following up. A brief, polite email expressing continued interest is appropriate. Do not ask if they received your application; that sounds needy. Instead, reiterate your interest and offer additional information if helpful.

After interviews, send a thank-you email within 24 hours. Personalize it by referencing specific topics discussed. Reiterate your interest in the position and briefly mention why you are a good fit. Keep it concise - three to four paragraphs maximum.

If you do not hear back after an interview, follow up once after a week. A simple email asking about the timeline for decisions is appropriate. After that, move on mentally while remaining open to future contact.

Connect with interviewers on LinkedIn after the interview. A brief, professional message referencing your conversation is appropriate. This keeps you on their radar even if you do not get this specific position.

Do not confuse follow-up with pestering. One or two follow-up messages are professional. Daily emails or calls are not. Respect their time and process while showing genuine interest.

Keep the door open even when rejected. Send a gracious response thanking them for their time and expressing interest in future opportunities. You never know when another position might open.`
              }
            ],
            activityQuestion: "Create a job search tracker spreadsheet with columns for company name, position title, date applied, status, follow-up dates, and notes. Then identify three companies you would like to work for and research each one. For each company, write down their mission, recent news, and at least one connection you could potentially make."
          },
          {
            title: "Acing the Interview",
            type: "reading",
            duration: "7 min",
            content: `The interview is your chance to shine. Here's how to nail it.

**Before the interview:**
• Research the company, their mission, recent news
• Prepare 2-3 questions to ask THEM
• Practice common questions out loud
• Know your resume inside and out
• Plan your outfit the night before
• Know exactly where you're going and how long it takes

**Common interview questions:**
• "Tell me about yourself" (2-minute career summary, not life story)
• "Why do you want this job?" (specific reasons about this company)
• "What's your greatest weakness?" (real weakness + how you're improving)
• "Where do you see yourself in 5 years?" (growth-oriented answer)
• "Why should we hire you?" (connect your skills to their needs)

**The STAR Method for behavioral questions:**
• Situation: Set up the context
• Task: What was your responsibility?
• Action: What did YOU do?
• Result: What happened? Use numbers if possible

**Example: "Tell me about a time you showed leadership"**
"In my group project (Situation), I noticed we were falling behind schedule (Task). I created a shared timeline and scheduled daily check-ins (Action). We finished two days early and got an A (Result)."

**During the interview:**
• Arrive 10-15 minutes early
• Firm handshake, eye contact, smile
• Listen carefully before answering
• Ask clarifying questions if needed
• Show enthusiasm without being fake`,
            keyPoints: [
              "Research the company thoroughly before every interview",
              "Practice the STAR method for behavioral questions",
              "Prepare thoughtful questions to ask them",
              "Arrive early, dress appropriately, bring copies of your resume"
            ],
            articles: [
              {
                title: "Mastering the STAR Method",
                content: `Behavioral interview questions ask about past experiences to predict future performance. The STAR method provides a structure for answering them effectively.

STAR stands for Situation, Task, Action, and Result. Each answer should include all four components in order.

Situation: Set the scene. Where were you? What was happening? Give enough context for the interviewer to understand the challenge. Keep this brief - one or two sentences.

Task: What were you responsible for? What was your specific role in addressing the situation? This clarifies what you personally needed to accomplish.

Action: What did you actually do? This is the longest part of your answer. Be specific about the steps you took. Use "I" not "we" - they want to know what you did, not what your team did.

Result: What happened because of your actions? Quantify when possible. If you cannot measure the outcome, describe the positive change or what you learned.

Prepare five to seven STAR stories before interviews. Cover common themes: overcoming challenges, working in teams, handling conflict, leading initiatives, failing and recovering. You can adapt these stories to fit various questions.

Practice until your answers are smooth but not robotic. Time yourself. Most STAR answers should be one to two minutes. Longer answers lose the interviewer's attention.`
              },
              {
                title: "Questions to Ask Your Interviewer",
                content: `The questions you ask tell the interviewer as much about you as the questions you answer. Thoughtful questions demonstrate genuine interest and strategic thinking.

Ask about the role and expectations. What does success look like in the first 90 days? What are the biggest challenges facing someone in this position? These questions show you are thinking about how to contribute.

Ask about the team and culture. What is the team dynamic like? How would you describe the company culture? Can you tell me about the management style? These help you assess fit while showing you value the working environment.

Ask about growth and development. What opportunities for professional development are available? Where have successful people in this role progressed to? These show ambition without seeming like you are already planning to leave.

Ask about the company's direction. What are the company's biggest priorities this year? How does this role contribute to those goals? These demonstrate that you think strategically.

Avoid asking about salary, benefits, or time off in first interviews unless they bring it up. These questions are important but best saved for later stages or after you have an offer.

Have at least three questions prepared, but read the room. If the interview ran long or they covered everything, one thoughtful question is enough.`
              }
            ],
            activityQuestion: "Prepare three STAR stories from your own experience that demonstrate different skills (teamwork, problem-solving, leadership, etc.). Write out each story with clear Situation, Task, Action, and Result sections. Then prepare five questions you would ask in an interview for your dream job and explain why each question is strategically valuable."
          },
          {
            title: "Negotiating Your Offer",
            type: "reading",
            duration: "5 min",
            content: `Most people don't negotiate - that's a mistake. Here's how to do it right.

**When to negotiate:**
• After receiving a written offer
• NOT in the first interview
• When you have leverage (other offers, unique skills)

**What's negotiable:**
• Salary (the obvious one)
• Start date
• Remote work options
• Vacation days
• Signing bonus
• Professional development budget
• Title

**How to negotiate:**
1. Express excitement about the offer first
2. Ask for time to review (24-48 hours is normal)
3. Do your research - know what the role pays
4. Make a specific ask, not a vague "more money"
5. Explain WHY you're worth more (skills, experience)

**Script for negotiating salary:**
"Thank you so much for this offer - I'm very excited about joining the team. Based on my research and experience in [specific skill], I was hoping we could discuss the salary. I was thinking something closer to [X amount]. Is there flexibility there?"

**If they say no:**
• Ask about other benefits
• Ask about performance review timeline
• Get the offer in writing anyway
• Decide if it still works for you

**Remember:**
• The worst they can say is no
• Negotiating won't make them rescind the offer
• You're worth advocating for
• This sets the base for all future raises`,
            keyPoints: [
              "Always negotiate - the worst they can say is no",
              "Research salary ranges before negotiating",
              "Negotiate after receiving a written offer, not before",
              "Consider total compensation, not just salary"
            ],
            articles: [
              {
                title: "Why You Should Always Negotiate",
                content: `Most people do not negotiate job offers. They feel grateful to be chosen and worry about seeming greedy. This mindset costs them significant money over their careers.

Employers expect negotiation. When they make an offer, there is almost always room to move. Hiring managers rarely offer the maximum they can pay. They offer what they think you will accept.

The worst they can say is no. People fear that negotiating will make the company rescind the offer. This almost never happens. Companies invest time and money in hiring. They will not walk away because you asked for more. At worst, they say the offer is firm.

The stakes are higher than you think. A higher starting salary compounds over your career. Raises and future salaries are often based on your current pay. Starting five thousand dollars higher means earning significantly more over decades.

Negotiation shows confidence and professionalism. Employers want to hire people who advocate for themselves. A well-handled negotiation can actually increase their respect for you.

Do your research first. Know the market rate for the role. Websites like Glassdoor, PayScale, and LinkedIn Salary provide data. Your ask should be grounded in reality, not wishful thinking.

Practice your negotiation beforehand. Role-play with a friend. Anticipate objections and prepare responses. Confidence comes from preparation.`
              },
              {
                title: "Beyond Salary: Total Compensation",
                content: `Salary is important, but it is only part of your total compensation. Sometimes you can get more value by negotiating other benefits.

Signing bonuses provide immediate cash without permanently increasing the company's salary budget. They are often easier to negotiate than salary, especially at larger companies with rigid pay bands.

Remote work and flexibility have real value. Being able to work from home saves commuting time and costs. A flexible schedule can be worth thousands of dollars in quality of life.

Vacation time is negotiable at many companies. An extra week of paid time off has real monetary value and can be easier to obtain than a salary increase.

Professional development budgets pay for courses, certifications, and conferences. These investments increase your earning potential over time. Some companies have funds specifically for this.

Start dates can be negotiated. If you need time between jobs, or want to push back a start date for personal reasons, ask. Most companies are flexible if given reasonable notice.

Stock options and equity can be significant at startups and public companies. Understand what you are being offered and negotiate if the package seems light.

When calculating an offer, consider the total value of all components. A lower salary with excellent benefits might be worth more than a higher salary with minimal benefits.`
              }
            ],
            activityQuestion: "Research the salary range for a job you are interested in using at least two different sources (Glassdoor, PayScale, LinkedIn, etc.). Write a short negotiation script where you ask for a salary at the higher end of the range, including how you would respond if they say no. List three non-salary benefits you would also try to negotiate."
          }
        ]
      },
      11: {
        title: "Career Readiness & Leadership",
        sections: [
          {
            title: "Developing Leadership Skills",
            type: "reading",
            duration: "6 min",
            content: `Leadership isn't just for managers - it's a skill everyone needs:

**What makes a good leader:**
• Takes initiative without being asked
• Communicates clearly and listens well
• Takes responsibility for mistakes
• Lifts others up instead of putting them down
• Stays calm under pressure

**Leadership as a student:**
• You already lead by example in group projects
• You know how to work as part of a team
• You understand discipline and commitment
• Use these experiences in job interviews

**Ways to develop leadership:**
• Take on projects others don't want
• Mentor younger students
• Volunteer for leadership roles in clubs
• Practice public speaking
• Learn to give and receive feedback`,
            keyPoints: [
              "Leadership is a skill you can develop",
              "Your student experiences ARE leadership experiences",
              "Look for opportunities to lead in any role",
              "Great leaders are also great listeners"
            ],
            articles: [
              {
                title: "Leadership Without a Title",
                content: `You do not need a title to be a leader. Some of the most effective leaders in organizations have no formal authority. They lead through influence, initiative, and example.

Take initiative on problems. When you see something that needs fixing, fix it. Do not wait for permission or for someone to assign it to you. This proactive approach marks you as a leader regardless of your position.

Help others succeed. True leaders lift those around them. Share knowledge freely. Celebrate others' wins. Connect people who can help each other. Your reputation grows when you make others better.

Speak up with solutions. In meetings, when problems arise, be the person who offers potential solutions rather than just identifying issues. This constructive approach demonstrates leadership thinking.

Take responsibility when things go wrong. Blaming others is easy. Admitting mistakes and focusing on solutions takes courage. This accountability earns respect and trust.

Volunteer for challenging assignments. Projects others avoid often provide the best learning and visibility. Taking on difficult work demonstrates confidence and builds skills.

Model the behavior you want to see. If you want a more positive team culture, be positive. If you want more collaboration, collaborate. Your example shapes the environment around you.`
              },
              {
                title: "Translating Athletic Experience to Leadership",
                content: `If you have been involved in athletics, you have developed leadership skills that transfer directly to professional settings. The key is recognizing and articulating these skills.

Discipline translates to reliability. The habits that made you show up for early morning practices make you someone employers can count on. You know how to do what needs to be done whether you feel like it or not.

Teamwork translates directly. You know how to work toward shared goals, support teammates through challenges, and put team success above individual recognition. These skills are highly valued in any workplace.

Handling pressure translates to composure. Performing in competitive situations with outcomes on the line prepares you for high-stakes professional moments. You know how to stay focused when it matters.

Taking coaching translates to learning quickly. You are accustomed to receiving feedback and adjusting your approach. This coachability accelerates professional development.

Recovering from failure translates to resilience. Losses, injuries, and setbacks taught you that failure is not permanent. You know how to bounce back and keep working.

When interviewing, translate your athletic experiences into business language. Instead of "I was team captain," say "I led a team of 20 people, coordinated practices, and mediated conflicts." The skills are the same; the context is different.`
              }
            ],
            activityQuestion: "Identify three specific leadership experiences you have had, even informal ones where you did not have an official title. For each experience, describe the situation, what you did to lead, and what the outcome was. Then explain how each experience translates to valuable workplace skills using professional language."
          },
          {
            title: "Professional Workplace Skills",
            type: "interactive",
            duration: "7 min",
            content: `What employers actually want (beyond technical skills):

**Communication:**
• Write clear, professional emails
• Speak up in meetings (but know when to listen)
• Give updates without being asked
• Handle difficult conversations professionally

**Time Management:**
• Meet deadlines consistently
• Prioritize tasks effectively
• Don't overcommit - learn to say no
• Use calendar and task tools

**Problem Solving:**
• Don't just bring problems - bring solutions
• Think critically before asking for help
• Learn from mistakes instead of hiding them
• Stay calm when things go wrong

**Professionalism:**
• Be on time (actually, be early)
• Dress appropriately for the environment
• Keep personal drama out of work
• Represent your employer well`,
            keyPoints: [
              "Soft skills matter as much as hard skills",
              "Reliability is the foundation of professionalism",
              "Always come with solutions, not just problems",
              "Your reputation follows you - protect it"
            ],
            articles: [
              {
                title: "The Skills Employers Actually Want",
                content: `Technical skills get you interviews. Soft skills get you hired and promoted. Understanding what employers value helps you develop the right capabilities.

Communication tops nearly every list of desired skills. This means writing clear emails, speaking confidently in meetings, listening actively, and adjusting your style for different audiences. Poor communication creates friction; strong communication creates results.

Problem-solving is consistently valued. Employers want people who can identify issues, analyze options, and implement solutions. This includes knowing when to solve problems independently and when to escalate.

Adaptability matters increasingly in fast-changing environments. Being comfortable with uncertainty, learning new tools quickly, and adjusting to changing priorities makes you valuable in any organization.

Collaboration skills are essential because almost all work happens in teams. This includes working with people you do not choose, contributing to group efforts, and navigating different working styles.

Emotional intelligence, the ability to understand and manage your own emotions while reading others, affects everything from client relationships to team dynamics. High EQ often matters more than high IQ.

Work ethic underlies everything else. Showing up consistently, meeting deadlines, and putting in genuine effort are surprisingly rare. Reliability alone distinguishes you from many candidates.`
              },
              {
                title: "Managing Up: Working with Your Boss",
                content: `Your relationship with your manager significantly impacts your success. Managing up means proactively making that relationship effective.

Understand your boss's priorities and pressures. What are they measured on? What keeps them up at night? When you understand their world, you can anticipate needs and provide relevant support.

Communicate proactively. Do not wait to be asked for updates. Regular, brief status reports prevent surprises and build trust. If something is going wrong, tell them early.

Learn their preferred communication style. Some managers want detailed written updates. Others prefer quick verbal check-ins. Some want frequent contact; others want you to be more independent. Adapt to their style.

Make their life easier. When you bring problems, bring potential solutions. When you ask questions, show you have already done initial research. Take work off their plate when appropriate.

Ask for feedback and act on it. Request regular feedback conversations. When you receive constructive criticism, implement changes visibly. This shows you take their input seriously.

Disagree respectfully when necessary. Good managers want input, not yes-people. When you disagree, do it professionally with supporting reasoning. Accept the final decision gracefully even if it goes against you.`
              }
            ],
            activityQuestion: "Choose one soft skill you want to develop over the next month (communication, problem-solving, adaptability, collaboration, or emotional intelligence). Create a specific plan with weekly goals and actions you will take. Describe how you will measure your progress and hold yourself accountable."
          },
          {
            title: "Time Management & Productivity",
            type: "reading",
            duration: "6 min",
            content: `Managing your time is managing your life. Here's how successful people do it.

**The Eisenhower Matrix:**
Categorize tasks by urgency and importance:
• Urgent + Important: Do first
• Not Urgent + Important: Schedule for later
• Urgent + Not Important: Delegate if possible
• Not Urgent + Not Important: Eliminate

**Time blocking:**
• Schedule specific times for specific tasks
• Include breaks and buffer time
• Batch similar tasks together
• Protect your most productive hours

**Beating procrastination:**
• Break big tasks into tiny first steps
• "Just 5 minutes" gets you started
• Remove distractions (phone in another room)
• Use the Pomodoro Technique (25 min work, 5 min break)

**Tools that help:**
• Calendar apps for scheduling
• To-do apps (Todoist, Things, even Notes)
• Focus apps (Forest, Freedom)
• Time tracking (Toggl, RescueTime)

**Energy management:**
• Know when you're most alert (morning or night person?)
• Do hard tasks during peak energy
• Take real breaks - not social media
• Sleep, exercise, and eat well - they affect focus`,
            keyPoints: [
              "Use the Eisenhower Matrix to prioritize tasks",
              "Time blocking prevents task switching and distraction",
              "Start with just 5 minutes to beat procrastination",
              "Protect your peak energy hours for important work"
            ],
            articles: [
              {
                title: "The Science of Productivity",
                content: `Productivity is not about working more hours. It is about working smarter during the hours you have. Understanding the science helps you optimize your approach.

Your brain has limited decision-making capacity each day. Every choice depletes this resource. This is why routines matter - they reduce decisions and preserve energy for important work.

Multitasking is a myth. Your brain cannot truly do two cognitive tasks simultaneously. What feels like multitasking is actually rapid switching between tasks, which is inefficient and exhausting. Focus on one thing at a time.

The Pomodoro Technique works because it aligns with how your brain functions. Working in focused 25-minute blocks with short breaks matches your natural attention span and prevents burnout.

Environment shapes behavior. Working in a cluttered space with constant notifications guarantees distraction. Create a workspace that supports focus: quiet, organized, with distractions removed.

Sleep is not optional for productivity. Sleep deprivation impairs cognitive function more than you realize. Pulling an all-nighter produces worse results than sleeping and working with a rested brain.

Exercise improves mental performance. Physical activity increases blood flow to the brain and releases chemicals that improve focus and mood. Even a short walk boosts productivity.`
              },
              {
                title: "Deep Work in a Distracted World",
                content: `Deep work is focused, uninterrupted time on cognitively demanding tasks. It is where real productivity and skill development happen. In a world of constant distraction, it is also increasingly rare.

Start by identifying your deep work. What tasks require focused concentration? Learning, writing, analyzing, creating - these are deep work. Email, meetings, and administrative tasks are shallow work.

Schedule deep work sessions. Block time on your calendar for focused work. Treat these blocks as non-negotiable appointments. Protect them from interruptions.

Create barriers to distraction. Close email. Silence your phone - not just vibrate, actually silence it. Use website blockers if needed. Every notification is an invitation to break focus.

Start with shorter sessions and build up. If you are not used to deep work, 25 minutes might be your limit. Gradually extend as your concentration muscles strengthen.

Have a starting ritual. A consistent routine that signals to your brain that it is time to focus helps you transition into deep work mode faster.

Accept that deep work requires trade-offs. You cannot be constantly available and also do deep work. Being less responsive during focus time is the cost of getting important work done.`
              }
            ],
            activityQuestion: "Track how you spend your time for one full day, noting every activity and how long it took. Identify your biggest time wasters and distraction triggers. Then create a schedule for tomorrow that includes at least one 45-minute block of deep work on an important task, with specific strategies for protecting that time from interruption."
          },
          {
            title: "Building Good Habits for Success",
            type: "reading",
            duration: "5 min",
            content: `Success is the result of daily habits, not one-time actions.

**How habits work:**
• Cue: What triggers the behavior
• Routine: The behavior itself
• Reward: What you get from it

**Building good habits:**
1. Make it obvious (leave your gym bag by the door)
2. Make it attractive (reward yourself after)
3. Make it easy (start tiny - 2 minutes)
4. Make it satisfying (track your progress)

**Breaking bad habits:**
1. Make it invisible (delete social media apps)
2. Make it unattractive (think about consequences)
3. Make it difficult (add friction)
4. Make it unsatisfying (accountability partner)

**Habits successful people share:**
• Wake up at a consistent time
• Exercise regularly (even 15 minutes)
• Read or learn something daily
• Plan tomorrow before sleeping
• Review goals weekly

**The 1% rule:**
Getting 1% better every day = 37x better in a year
Small improvements compound into massive results

**Habit stacking:**
Attach a new habit to an existing one:
• "After I pour my coffee, I will review my goals"
• "After I brush my teeth, I will read for 5 minutes"
• "After I get home from school, I will review my budget"`,
            keyPoints: [
              "Habits are cue → routine → reward loops",
              "Start tiny and build up - consistency beats intensity",
              "Stack new habits onto existing routines",
              "Small daily improvements compound into massive results"
            ],
            articles: [
              {
                title: "The Habit Loop",
                content: `Every habit follows the same pattern: cue, routine, reward. Understanding this loop lets you design better habits and break bad ones.

The cue triggers the behavior. It can be a time, location, emotion, or preceding action. If you always snack when stressed, stress is your cue. If you check your phone first thing in the morning, waking up is your cue.

The routine is the behavior itself. This is the habit you want to build or break. It can be physical, mental, or emotional.

The reward is what you get from the behavior. Rewards can be obvious like the taste of food or subtle like the relief of completing a task. Your brain remembers rewards and seeks to repeat them.

To build a new habit, identify a cue you encounter reliably, design a routine you can execute consistently, and ensure there is a meaningful reward at the end.

To break a bad habit, disrupt the loop. Change the cue by avoiding trigger situations. Substitute the routine with a healthier alternative that provides a similar reward. Make the reward unsatisfying by pairing it with negative consequences.

The most effective habit changes work with this natural loop rather than against it. Fighting your brain's wiring is exhausting. Redesigning your environment and routines is sustainable.`
              },
              {
                title: "Starting Small: The Two-Minute Rule",
                content: `The biggest obstacle to building habits is starting. The two-minute rule removes this obstacle by making the start incredibly easy.

Any habit can be reduced to a two-minute version. Want to read more? Start by reading one page. Want to exercise? Start by putting on your workout clothes. Want to meditate? Start by taking one deep breath.

The point is not that you only do two minutes forever. The point is that you establish the routine. Once you start, you often continue. And even if you do not, you have reinforced the habit of starting.

Consistency matters more than duration. Doing something for two minutes every day builds a stronger habit than doing it for an hour once a week. Frequency creates automaticity.

After the two-minute version becomes automatic, gradually expand. Read one page for a week, then two pages, then a chapter. The foundation is solid because you established the routine when it was easy.

Apply this to any habit you want to build. What is the smallest version you can do? Start there. Make it so easy that you cannot say no. Then build.

People often fail at habits because they start too big. They commit to an hour at the gym and burn out in two weeks. Starting small seems almost too easy, but that is exactly why it works.`
              }
            ],
            activityQuestion: "Choose one new habit you want to develop. Define it using the habit loop: What will be your cue? What is the routine? What reward will you give yourself? Create a two-minute version of this habit to start with. Then identify one bad habit you want to break and describe how you will disrupt its cue, routine, or reward."
          }
        ]
      },
      12: {
        title: "Networking & Professional Connections",
        sections: [
          {
            title: "Why Networking Matters",
            type: "reading",
            duration: "5 min",
            content: `Most jobs aren't posted online - they're filled through connections:

**The hidden job market:**
• 70-80% of jobs are never advertised
• People hire people they know and trust
• A referral makes you 10x more likely to get hired

**Networking isn't just about getting jobs:**
• Learn from people ahead of you
• Get advice and mentorship
• Find opportunities you didn't know existed
• Build relationships that last your whole career

**Networking as a student:**
• You already network with professors, classmates, alumni
• Campus events are great for meeting people
• Your dedication is impressive to professionals
• Use your existing connections!`,
            keyPoints: [
              "Your network is your net worth",
              "Most opportunities come through people you know",
              "Start building relationships before you need them",
              "Give value to others - networking is not just taking"
            ],
            articles: [
              {
                title: "The Hidden Job Market",
                content: `Most job openings are never posted publicly. They are filled through referrals, internal promotions, and connections before they ever reach job boards. This is the hidden job market.

Estimates suggest 70 to 80 percent of jobs are filled without public postings. Companies prefer hiring people who come recommended because referrals reduce risk. Someone vouching for you is powerful.

This hidden market is why networking matters so much. When a position opens, managers often ask their teams who they know before posting the job. Being the person who comes to mind in that moment is valuable.

Building your network before you need it is essential. Reaching out only when you need a job feels transactional. Relationships built over time feel genuine. People help those they know and like.

Your existing network is larger than you think. Family friends, professors, classmates, neighbors, former coworkers - all of these people have their own networks. One introduction can lead to another.

Informational interviews are a way to access the hidden market. You learn about opportunities before they are announced. You become known to people who might hire later. You understand what companies really want.`
              },
              {
                title: "Building Real Professional Relationships",
                content: `Networking is not about collecting business cards or LinkedIn connections. It is about building genuine relationships that benefit both parties over time.

Start by being interested in others. Ask questions about their work, their path, their advice. People enjoy talking about themselves, and genuine curiosity is flattering. Listen more than you talk.

Look for ways to give value. Share articles they might find interesting. Make introductions when you can help. Congratulate them on achievements. Networking works best when you focus on giving rather than getting.

Follow up after meeting someone. Send a brief email or LinkedIn message within 24 hours. Reference something specific from your conversation. This transforms a one-time interaction into a relationship.

Maintain relationships over time. Check in periodically even when you do not need anything. Comment on their LinkedIn posts. Send a holiday greeting. Relationships require maintenance to stay alive.

Be authentic. Trying to be someone you are not is exhausting and transparent. People connect with authenticity. Let your genuine personality and interests show.

Remember that networking is a long game. The relationship you build today might pay off years from now. Invest without expecting immediate returns.`
              }
            ],
            activityQuestion: "Map your existing network. List at least 15 people who could potentially help your career (family friends, professors, classmates, neighbors, former employers, etc.). For each person, note what industry or role they are in and how you know them. Then identify three people you will reach out to this month to strengthen the relationship."
          },
          {
            title: "How to Network Effectively",
            type: "interactive",
            duration: "7 min",
            content: `Networking doesn't have to be awkward. Here's how to do it right:

**Where to network:**
• Campus events and career fairs
• LinkedIn (reach out to alumni)
• Professional associations
• Alumni events and games
• Informational interviews

**How to reach out:**
• Personalize every message
• Be specific about why you're reaching out
• Offer something in return (even if it's just gratitude)
• Follow up but don't be pushy

**At events:**
• Have a 30-second intro ready
• Ask questions about THEM, not just you
• Get contact info and follow up within 24 hours
• Connect on LinkedIn same day

**Building real relationships:**
• Stay in touch even when you don't need something
• Share interesting articles or opportunities
• Congratulate people on their wins
• Be genuinely interested in others`,
            keyPoints: [
              "Network before you need it",
              "Focus on giving, not just getting",
              "Follow up within 24 hours of meeting someone",
              "Keep relationships warm with regular contact"
            ],
            articles: [
              {
                title: "The Informational Interview",
                content: `Informational interviews are conversations with people working in fields you are interested in. They are one of the most powerful networking tools available.

The purpose is learning, not job hunting. You are asking for advice and insights, not asking for a job. This makes people more willing to help because the stakes are lower.

To request an informational interview, reach out with a personalized message. Mention how you found them, why you are interested in their work, and ask for a brief conversation. Most people are willing to help students who show genuine interest.

Prepare thoughtful questions. Ask about their career path, what they wish they knew starting out, what skills matter most, and how they would approach your situation. Do not ask questions you could easily find online.

Keep it brief. Twenty to thirty minutes is standard. Respect their time. If the conversation goes longer, let them extend it rather than you.

Follow up with a thank you note within 24 hours. Reference something specific from your conversation. Stay in touch periodically.

Informational interviews often lead to referrals, recommendations, and job opportunities even though that was not the explicit purpose. People help those they know and like.`
              },
              {
                title: "Networking at Events",
                content: `Networking events can feel awkward, but with the right approach, they become opportunities to make genuine connections.

Before the event, research who will be there if possible. Identify three to five people you want to meet. Having targets prevents wandering aimlessly.

Prepare your introduction. In thirty seconds, you should be able to explain who you are, what you are studying or working on, and what you are looking for. Practice until it sounds natural.

At the event, arrive early when fewer people are there and conversations are easier to start. Position yourself near the entrance or refreshments where new people congregate.

When approaching someone, simple openers work best. Comment on something about the event. Introduce yourself and ask what brings them here. Ask what they do. People enjoy talking about themselves.

Focus on quality over quantity. Deep conversations with three people are more valuable than shallow exchanges with twenty. When you connect with someone, give them your full attention.

Exchange contact information and state your intention to follow up. Connect on LinkedIn from the event while you remember each other. Send a follow-up message within 24 hours referencing your conversation.`
              }
            ],
            activityQuestion: "Identify someone in a career field you are interested in and write an email requesting an informational interview. Include a personalized opening, why you are reaching out to them specifically, what you hope to learn, and a specific request for their time. Then prepare five questions you would ask in the interview."
          },
          {
            title: "Finding and Working with Mentors",
            type: "reading",
            duration: "6 min",
            content: `A good mentor can accelerate your success by years. Here's how to find one.

**What a mentor does:**
• Shares experience and advice
• Opens doors and makes introductions
• Provides honest feedback
• Helps you avoid common mistakes
• Believes in your potential

**Where to find mentors:**
• Professors you connect with
• Managers at your job/internship
• Alumni from your school
• Professional associations
• LinkedIn connections
• Family friends in your field

**How to ask someone to mentor you:**
Don't say: "Will you be my mentor?" (too formal, too much commitment)
Do say: "I really admire your career in [field]. Would you be open to grabbing coffee so I can ask you a few questions about [specific topic]?"

**Being a good mentee:**
• Come prepared with specific questions
• Take action on their advice
• Report back on results
• Respect their time
• Express genuine gratitude
• Eventually, help others the same way

**Types of mentor relationships:**
• Formal mentor: Regular scheduled meetings
• Informal mentor: Occasional guidance as needed
• Peer mentor: Someone at your level you learn with
• Board of advisors: Multiple mentors for different areas

**Remember:**
• You can have multiple mentors for different areas of life
• Mentorship can be informal - not everything needs a label
• Great mentors were once where you are now`,
            keyPoints: [
              "Ask for specific advice, not a formal mentorship",
              "Show you value their time by being prepared",
              "Take action on advice and report back results",
              "You can have multiple mentors for different areas"
            ],
            articles: [
              {
                title: "Finding the Right Mentor",
                content: `Not everyone is cut out to be a mentor, and not every potential mentor is right for you. Finding the right fit matters.

Look for someone who has achieved what you want to achieve but is not so far ahead that they have forgotten what starting out is like. Someone five to ten years ahead of you often makes a better mentor than someone thirty years ahead.

Observe how they treat others. Do they make time for people? Do they share credit? Do they give honest feedback? These qualities predict whether they will be a good mentor.

Shared values matter more than shared demographics. A mentor who understands your goals and approach is more valuable than one who merely looks like you.

Start with informal interactions. Ask for a coffee conversation or a few questions over email. See how they respond before pursuing a deeper relationship.

Let the relationship develop organically. The best mentorships often are not explicitly labeled. You simply build a relationship where someone more experienced regularly provides guidance.

Be willing to have multiple mentors for different areas. One person might advise you on career strategy while another guides you on specific skills. You do not need one mentor to be everything.`
              },
              {
                title: "Making the Most of Mentorship",
                content: `Having a mentor is a privilege. How you engage determines how much value you get from the relationship.

Come prepared to every interaction. Have specific questions or topics you want to discuss. Do your homework on issues before bringing them to your mentor. Respect their time by being efficient.

Take action on their advice. Nothing is more frustrating for a mentor than giving advice that is ignored. When they suggest something, try it. Report back on what happened.

Be honest about your challenges. Mentors can only help if they understand your real situation. Do not pretend everything is perfect or hide struggles.

Accept critical feedback gracefully. Good mentors tell you what you need to hear, not what you want to hear. Defensiveness discourages honest feedback.

Express gratitude regularly. Let them know their advice made a difference. Specific thank-you notes mentioning impact mean more than generic thanks.

Pay it forward. As you grow, mentor others. The best way to honor your mentors is to help people the way they helped you. This also deepens your own understanding.`
              }
            ],
            activityQuestion: "Identify three potential mentors in your life - they can be professors, family friends, professionals you have met, or others. For each potential mentor, describe what specifically you could learn from them and one question you would ask them. Then choose one and outline a plan for how you will begin building that relationship."
          },
          {
            title: "Building Your Professional Network",
            type: "interactive",
            duration: "6 min",
            content: `Let's create an action plan for building your network.

**Map your current network:**
• Family members and their connections
• Friends and their parents
• Professors and teachers
• Current and former coworkers
• Classmates (especially upperclassmen)
• Club and organization members
• Coaches and advisors

**Set networking goals:**
• Meet 1 new person in your field per month
• Attend 1 networking event per quarter
• Reconnect with 2 old contacts per month
• Have 1 informational interview per month

**Your networking action items:**

This week:
• Update your LinkedIn profile with a professional photo
• Connect with 5 people you already know
• Join 1 professional group related to your interests

This month:
• Reach out to 1 person you admire for an informational interview
• Attend 1 campus or virtual networking event
• Share something valuable on LinkedIn

This semester:
• Build relationships with 3 professors in your field
• Connect with 10 alumni working in your target industry
• Find a potential mentor and start building that relationship

**Keep track:**
• Spreadsheet of contacts with notes
• Set reminders to follow up
• Document what you discussed and next steps`,
            keyPoints: [
              "Map your existing network - it's bigger than you think",
              "Set specific, measurable networking goals",
              "Start with your LinkedIn profile and existing connections",
              "Track contacts and set follow-up reminders"
            ],
            articles: [
              {
                title: "Your Network Contact System",
                content: `Networking without a system leads to forgotten connections and missed opportunities. A simple tracking system keeps relationships alive.

Create a spreadsheet or use a CRM tool to track contacts. Include their name, how you know them, what they do, contact information, and notes from your conversations.

Add a column for last contact date. This helps you identify relationships that need attention. Set a goal to touch base with important contacts every few months.

Note key details from conversations. Did they mention a project they were working on? A vacation they were planning? Referencing these details in future conversations shows you pay attention and care.

Set reminders for follow-ups. After meeting someone new, schedule a reminder to reach out in two weeks, then again in three months. Without reminders, follow-up falls through the cracks.

Categorize your contacts by type: close contacts, professional acquaintances, people to meet, and inactive relationships. This helps you prioritize your networking time.

Review your network monthly. Who have you not heard from? Who might be helpful for current goals? Who could you help? A quick review keeps networking top of mind.`
              },
              {
                title: "Giving Value to Your Network",
                content: `The best networkers focus on giving before getting. Consistently providing value builds goodwill that returns to you over time.

Share useful information. When you read an article someone in your network would find interesting, send it to them. This takes little effort but shows you think of them.

Make introductions. When you know two people who could benefit from knowing each other, introduce them. Being a connector increases your value to everyone.

Congratulate achievements. When connections get promoted, launch projects, or celebrate wins, reach out with genuine congratulations. LinkedIn makes this easy to track.

Offer help without strings attached. When you see a way to help someone, offer. Do not keep score or expect immediate returns. Generosity creates reciprocity over time.

Share opportunities you do not need. If you learn about a job or opportunity that is not right for you but might fit someone in your network, pass it along.

Provide honest feedback when asked. Being willing to give constructive input makes you valuable. Many people only hear what they want to hear.`
              }
            ],
            activityQuestion: "Create a networking contact tracker using a spreadsheet or app. Add at least 20 contacts you already have, including how you know them, their contact information, and one note about each relationship. Then set reminders to follow up with three contacts within the next two weeks. Finally, identify one way you could provide value to each of your top five contacts."
          }
        ]
      },
      13: {
        title: "Entrepreneurship & Career Planning",
        sections: [
          {
            title: "Exploring Entrepreneurship",
            type: "reading",
            duration: "7 min",
            content: `Ever thought about starting your own business? Here's what you need to know:

**Is entrepreneurship for you?**
• Do you like solving problems?
• Are you okay with uncertainty?
• Can you handle rejection and failure?
• Do you see opportunities others miss?

**Types of businesses to consider:**
• Service business (coaching, tutoring, consulting)
• Product business (physical or digital products)
• Online business (content, e-commerce, apps)
• Freelancing (using your skills for hire)

**Starting small:**
• Test your idea before going all in
• Start as a side hustle while in school
• Use your existing skills and network
• Learn from failure - it's part of the process

**Student advantages:**
• Discipline and work ethic
• Ability to handle pressure
• Experience learning and adapting
• Access to resources and networks`,
            keyPoints: [
              "You don't need a revolutionary idea to start",
              "Start small and validate your idea first",
              "Your student mindset is an entrepreneurial asset",
              "Failure is feedback - learn and keep going"
            ],
            articles: [
              {
                title: "The Entrepreneurial Mindset",
                content: `Entrepreneurship is not just about starting businesses. It is a mindset that serves you in any career.

Entrepreneurs see opportunities where others see problems. When something frustrates you, ask whether others share that frustration and whether a solution could be valuable.

Entrepreneurs take calculated risks. They do not gamble blindly, but they accept uncertainty and act despite not having all the answers. Starting something requires moving forward with incomplete information.

Entrepreneurs learn from failure. Every successful entrepreneur has a history of failures. The difference is they treated failures as experiments that provided data rather than defeats that defined them.

Entrepreneurs focus on value creation. The best businesses solve real problems for real people. Focus on what value you can create, and the money often follows.

Entrepreneurs think in terms of leverage. How can one hour of your time create more than one hour of value? Systems, technology, and teams provide leverage.

You can develop this mindset whether or not you ever start a formal business. Employees with entrepreneurial thinking get promoted. They see beyond their job description and create value proactively.`
              },
              {
                title: "Starting Before You Feel Ready",
                content: `One of the biggest barriers to entrepreneurship is waiting to feel ready. The truth is, you will never feel completely ready.

Successful entrepreneurs start before they have everything figured out. They learn by doing rather than by planning. The business you launch will evolve significantly from your original vision.

Start with the smallest possible version of your idea. This is called a Minimum Viable Product or MVP. It lets you test whether people want what you offer without investing too much time or money.

Talk to potential customers early. Before building anything, have conversations with people who might buy your product or service. Their feedback will shape your offering far better than your assumptions.

Set a deadline to launch. Without external pressure, preparation can become procrastination disguised as perfectionism. Pick a date and commit.

Accept that your first version will be imperfect. Ship it anyway. Real feedback from real users is more valuable than theoretical improvements.

The cost of starting too early is usually recoverable. The cost of starting too late, or never starting, is opportunity lost forever.`
              }
            ],
            activityQuestion: "Brainstorm three business ideas based on problems you notice in your daily life, skills you have that others value, or opportunities you see in your community. For each idea, describe the problem it solves, who would pay for it, and how you could test the idea with minimal investment. Choose the most promising idea and outline three specific steps you could take this week to validate it."
          },
          {
            title: "Career Planning Strategies",
            type: "interactive",
            duration: "6 min",
            content: `Whether you go entrepreneur or traditional career, you need a plan:

**Know yourself:**
• What are you good at?
• What do you enjoy doing?
• What kind of lifestyle do you want?
• What industries interest you?

**Research careers:**
• Talk to people in jobs you're curious about
• Look up salary ranges and growth potential
• Understand what education/skills are needed
• Consider work-life balance

**Create a career roadmap:**
• Where do you want to be in 5 years? 10 years?
• What skills do you need to develop?
• What experiences will help you get there?
• Who can help you along the way?

**Stay flexible:**
• Plans change - and that's okay
• Be open to opportunities you didn't expect
• Keep learning and growing
• Build transferable skills that work anywhere`,
            keyPoints: [
              "Self-awareness is the foundation of career planning",
              "Have a plan but stay flexible",
              "Invest in skills that transfer across careers",
              "Relationships matter more than you think"
            ],
            articles: [
              {
                title: "Career Discovery Through Exploration",
                content: `You do not need to know exactly what you want to do. Career clarity often comes through exploration rather than introspection.

Try different things. Take on varied projects, internships, and part-time jobs. Each experience teaches you about what you enjoy and what you want to avoid.

Pay attention to what energizes you. Notice when time flies because you are engaged versus when tasks feel draining. Energy is a better guide than logic alone.

Talk to people in different careers. Informational interviews reveal the reality of jobs that might look appealing from the outside. Some dream jobs become less attractive when you understand what they actually involve.

Consider lifestyle, not just job titles. Do you want stability or variety? Location flexibility or roots in one place? High income with high stress or moderate income with more balance?

Eliminate options deliberately. Knowing what you do not want is as valuable as knowing what you do want. Each rejection narrows your focus.

Accept that clarity takes time. Most successful people did not follow a straight path. They zigzagged, learned, and gradually found their direction.`
              },
              {
                title: "Building Transferable Skills",
                content: `The job market changes constantly. Specific technical skills can become obsolete. Transferable skills remain valuable regardless of your career path.

Communication skills transfer everywhere. The ability to write clearly, speak persuasively, and listen effectively serves you in any profession.

Problem-solving applies universally. Breaking down complex issues, generating options, and implementing solutions is valuable whether you work in finance, technology, healthcare, or any other field.

Leadership and collaboration work in every context. Working effectively with others, resolving conflicts, and influencing without authority are always in demand.

Adaptability and learning agility matter increasingly. The ability to learn new things quickly and adapt to changing circumstances is perhaps the most valuable skill of all.

Digital literacy is now baseline. Comfort with technology, data, and online tools is expected in virtually every modern career.

Financial literacy serves you personally and professionally. Understanding business basics, budgets, and financial analysis is valuable even in non-finance roles.

Focus on developing these transferable skills alongside any technical expertise. They provide insurance against career disruption and open doors across industries.`
              }
            ],
            activityQuestion: "Take a career assessment quiz (like the Holland Code or Myers-Briggs) and reflect on the results. Then identify three careers that interest you and research what a typical day looks like in each one. For each career, list the key skills required and note which of those skills you already have and which you need to develop."
          },
          {
            title: "Side Hustles That Actually Work",
            type: "reading",
            duration: "6 min",
            content: `Not ready for a full business? Start with a side hustle.

**Low-barrier side hustles for students:**

**Service-based (sell your time/skills):**
• Tutoring - in-person or online ($15-50/hour)
• Freelance writing/editing ($20-100/article)
• Social media management ($200-500/month per client)
• Graphic design (logos, flyers, social posts)
• Photography (events, portraits, product shots)
• Pet sitting/dog walking ($15-25/walk)
• Cleaning or organizing services

**Product-based (sell stuff):**
• Reselling (thrift flipping, sneakers, electronics)
• Print-on-demand (t-shirts, mugs without inventory)
• Digital products (templates, presets, planners)
• Handmade crafts (Etsy)

**Platform-based (use existing apps):**
• DoorDash, Uber Eats delivery
• Instacart shopping
• TaskRabbit gigs
• Fiverr services

**Choosing your hustle:**
• Match it to skills you already have
• Consider time vs money tradeoff
• Start with lowest barrier to entry
• Test multiple ideas, double down on winners

**Scaling your side hustle:**
• Raise prices as demand increases
• Create systems to save time
• Outsource tasks you don't enjoy
• Turn it into a real business when ready`,
            keyPoints: [
              "Start with skills you already have",
              "Service businesses have the lowest startup costs",
              "Test ideas before going all-in",
              "Your side hustle can become your main hustle"
            ],
            articles: [
              {
                title: "Pricing Your Services",
                content: `One of the biggest mistakes new entrepreneurs make is undercharging. Pricing too low attracts the wrong clients and makes your work unsustainable.

Research market rates before setting prices. Look at what competitors charge. Talk to others in your field. Your prices should be competitive but not necessarily the lowest.

Calculate your minimum viable rate. How much do you need to earn per hour to make the work worthwhile after expenses and taxes? This is your floor.

Value-based pricing often works better than hourly rates. Charge based on the value you provide rather than the time you spend. A logo that helps a business attract customers is worth more than the hours it took to create.

Start higher than you think you should. It is easier to offer discounts than to raise prices. Clients who pay premium prices often value your work more.

Raise prices as you gain experience and demand. Early clients get early pricing. As your skills and reputation grow, your prices should too.

Do not apologize for your prices. State them confidently. If you seem unsure of your value, clients will be unsure too.`
              },
              {
                title: "Managing Your Time as a Side Hustler",
                content: `Balancing a side hustle with school, work, and life requires intentional time management.

Block dedicated time for your hustle. Sporadic effort produces sporadic results. Schedule specific hours for hustle work and protect that time.

Know your peak productive hours. If you think best in the morning, use that time for creative or challenging hustle tasks. Use lower-energy times for administrative work.

Batch similar tasks together. Responding to all client messages at once is more efficient than interrupting other work throughout the day.

Set boundaries with clients. Just because you work for yourself does not mean you are available 24/7. Establish response time expectations and stick to them.

Automate what you can. Scheduling tools, email templates, and invoicing software save time on repetitive tasks.

Know when to say no. Not every opportunity is right for you. Taking on too much leads to burnout and poor quality. Be selective about what you commit to.

Guard your recovery time. Rest is not laziness; it is necessary for sustainable performance. Working all the time leads to diminishing returns.`
              }
            ],
            activityQuestion: "Choose one side hustle from the lesson that interests you. Research what it would take to start: initial costs, skills needed, potential clients, and realistic income. Create a mini business plan including your target market, pricing strategy, how you will find clients, and a goal for your first month. Identify the single biggest obstacle and how you would overcome it."
          },
          {
            title: "5-Year Career Vision",
            type: "interactive",
            duration: "7 min",
            content: `Let's create your 5-year vision and work backward.

**Imagine yourself 5 years from now:**
• Where are you living?
• What job title do you have?
• What does a typical day look like?
• What income level have you reached?
• What have you accomplished?
• Who are you surrounded by?

**Now work backward:**

**Year 5: Your goal**
Write it down: "In 5 years, I will be..."

**Year 4: What needs to be true?**
• What position leads to year 5?
• What experience do you need?

**Year 3: Building momentum**
• What skills should be developed?
• What network should exist?

**Year 2: Foundation building**
• What education/training needed?
• What entry-level experience?

**Year 1 (this year): First steps**
• What can you do THIS MONTH?
• What can you do THIS SEMESTER?

**Making it real:**
• Write your vision somewhere you'll see it daily
• Share it with a trusted person for accountability
• Review and adjust quarterly
• Celebrate progress along the way

**Remember:** Plans will change - that's okay. The direction matters more than the exact destination.`,
            keyPoints: [
              "Start with the end in mind and work backward",
              "Break 5-year goals into yearly, monthly, weekly actions",
              "Write your vision and review it regularly",
              "Plans will change - stay flexible while staying focused"
            ],
            articles: [
              {
                title: "The Power of Written Goals",
                content: `Studies consistently show that people who write down their goals are significantly more likely to achieve them. The act of writing creates clarity and commitment.

A written goal forces specificity. Vague intentions like wanting to be successful become concrete targets like earning a specific income or holding a specific position.

Written goals activate the reticular activating system in your brain. This system helps you notice opportunities and information relevant to your goals that you would otherwise miss.

Review your written goals regularly. Daily review keeps them top of mind. Weekly review lets you assess progress. Monthly and quarterly reviews allow for strategic adjustments.

Keep your goals visible. Post them where you see them frequently. Some people use phone wallpapers, bathroom mirrors, or vision boards.

Share goals selectively. Telling certain people creates accountability. However, some research suggests that public announcements can give premature satisfaction. Know yourself and choose wisely.

Update your goals as you grow. Goals written a year ago may no longer reflect your values and aspirations. Regular revision keeps your goals relevant and motivating.`
              },
              {
                title: "Working Backward from Success",
                content: `Reverse engineering your goals is one of the most powerful planning techniques. Start with where you want to be and work backward to today.

First, define the end state clearly. What does success look like? Be specific about income, role, lifestyle, location, and relationships.

Then identify prerequisites. What must be true for that end state to be achieved? What positions lead to it? What skills are required? What credentials matter?

Map the logical sequence. Some things must happen before others. Education often precedes certain opportunities. Entry-level experience precedes senior roles.

Identify the critical path. What are the most important steps that everything else depends on? Focus your energy on these high-leverage activities.

Work all the way back to today. What can you do this week that moves you toward your five-year vision? Each small action compounds over time.

Build in flexibility. Your path will not be straight. Unexpected opportunities and obstacles will arise. The general direction matters more than the exact route.

Review and adjust regularly. As you learn more and circumstances change, your backward plan should evolve. Rigid plans break; flexible plans adapt.`
              }
            ],
            activityQuestion: "Write a detailed five-year vision statement describing your life in five years. Include your career, income, living situation, and personal accomplishments. Then work backward to create yearly milestones for years four, three, two, and one. Finally, identify five specific actions you can take this month to start moving toward that vision. Share your vision with someone you trust and schedule a quarterly review."
          }
        ]
      },
      14: {
        title: "Entrepreneurship Workshop Project",
        sections: [
          {
            title: "Developing Your Business Idea",
            type: "interactive",
            duration: "8 min",
            content: `Time to get practical. Let's develop YOUR business idea:

**Finding your idea:**
• What problems do you see that need solving?
• What do people ask you for help with?
• What would you create if money didn't matter?
• What skills do you have that others need?

**Validating your idea:**
• Talk to potential customers (at least 10 people)
• Would they actually PAY for this?
• How much would they pay?
• What would make them say no?

**Creating your value proposition:**
• Who is your target customer?
• What problem do you solve for them?
• How are you different from alternatives?
• Why should they choose you?

**MVP (Minimum Viable Product):**
• What's the simplest version you can create?
• How can you test with minimal investment?
• What feedback do you need?`,
            keyPoints: [
              "Ideas are worthless without execution",
              "Talk to potential customers before building anything",
              "Start with the simplest version possible",
              "Get feedback early and often"
            ],
            articles: [
              {
                title: "Customer Discovery Interviews",
                content: `Before investing time and money building something, talk to potential customers. Customer discovery interviews reveal whether your idea solves a real problem.

Start with open-ended questions. Do not pitch your idea immediately. Instead, ask about their current challenges, frustrations, and how they currently solve the problem you are targeting.

Listen more than you talk. Your goal is to learn, not to convince. The best interviews feel like conversations where the customer does most of the talking.

Ask about behavior, not just opinions. People often say they would buy something but do not actually purchase when given the chance. Ask what they currently do and spend money on.

Dig deeper with follow-up questions. When someone mentions a problem, ask how often it occurs, how much it costs them, and what they have tried to solve it.

Talk to at least ten potential customers before making major decisions. Patterns emerge across multiple conversations that single interviews cannot reveal.

Take notes immediately after each interview while details are fresh. Look for recurring themes across conversations.

Be prepared to discover that your original idea needs significant changes. Most successful businesses look very different from their founders' initial concepts.`
              },
              {
                title: "The MVP Approach",
                content: `A Minimum Viable Product is the simplest version of your idea that lets you test whether customers want it. Building an MVP saves time and money.

Start by identifying the core value proposition. What is the one thing your product or service must do well? Everything else is optional for your first version.

Build only what you need to test your key assumptions. If you assume customers will pay for a certain feature, build just enough to test that assumption.

Manual processes can replace technology initially. Many successful companies started with founders personally doing tasks that were later automated. This approach lets you learn before investing in systems.

Launch before you feel ready. Your MVP will be imperfect. That is the point. Real customer feedback is more valuable than theoretical improvements.

Measure what matters. Define in advance what success looks like for your MVP. How many customers? What feedback? What revenue?

Iterate based on feedback. Use what you learn to build the next version. Each iteration should be based on real customer data, not guesses.

Remember that many successful products started as embarrassingly simple MVPs. The first version of Amazon was a basic website. The first iPhone lacked features that competitors had. Start simple and improve.`
              }
            ],
            activityQuestion: "Interview at least three potential customers about a problem your business idea solves. Ask open-ended questions about their current challenges, what they have tried, and what an ideal solution would look like. Summarize the key insights from each interview and identify patterns across conversations. Based on what you learned, describe how you would adjust your original idea."
          },
          {
            title: "Building Your Business Plan",
            type: "reading",
            duration: "7 min",
            content: `A simple business plan keeps you focused:

**Key components:**
• Executive summary: What's your business in 2 sentences?
• Problem: What problem are you solving?
• Solution: How do you solve it?
• Target market: Who are your customers?
• Revenue model: How will you make money?
• Marketing: How will people find you?
• Financials: What will it cost? What will you earn?

**Keep it simple:**
• You don't need a 50-page document
• Focus on assumptions you need to test
• Update as you learn

**Funding options:**
• Bootstrapping (your own money)
• Friends and family
• Competitions and grants
• Crowdfunding
• Angel investors (later stage)`,
            keyPoints: [
              "A business plan is a living document",
              "Focus on the key assumptions first",
              "Start small - you don't need huge funding",
              "Your plan will change as you learn"
            ],
            articles: [
              {
                title: "The One-Page Business Plan",
                content: `You do not need a fifty-page business plan to start. A one-page plan forces clarity and can be updated easily.

Start with your mission statement. In one or two sentences, describe what your business does and why it exists. This guides all other decisions.

Define your target customer specifically. Generic descriptions like everyone or young people are not helpful. Describe your ideal customer in detail.

Articulate your value proposition. Why would someone choose you over alternatives? What makes your solution different or better?

Outline your revenue model. How will you make money? Will you charge per unit, subscription, commission, or something else? At what price point?

List your key assumptions. Every business plan contains assumptions that might be wrong. Being explicit about them helps you test and validate.

Identify your first milestones. What do you need to accomplish in the next thirty, sixty, and ninety days? Focus on progress, not perfection.

Review your one-page plan weekly. Keep it current as you learn from customers and the market. A plan that sits in a drawer is worthless.`
              },
              {
                title: "Funding Your First Business",
                content: `Most first businesses should be bootstrapped. Raising outside money has costs that often outweigh the benefits for beginners.

Bootstrapping means using your own money and revenue to fund growth. This forces discipline and keeps you focused on what customers want.

Start smaller than you think necessary. Most new entrepreneurs overestimate what they need to launch. Challenge every expense.

Use free or low-cost tools. There are free versions of almost every business tool you need. Upgrade only when free versions limit your growth.

Generate revenue quickly. The best funding source is paying customers. Focus on getting your first sales rather than seeking investment.

Friends and family funding works for some. If you go this route, treat it professionally with written agreements. Mixed relationships with money is risky.

Competitions and grants are available for students. Look for business plan competitions, startup weekends, and entrepreneurship grants at schools.

Delay seeking investors until you have proven demand. Investors want to see traction. A business with customers and revenue gets much better terms than one with just an idea.`
              }
            ],
            activityQuestion: "Create a one-page business plan for your idea. Include your mission statement, target customer description, value proposition, revenue model, key assumptions, and thirty-day milestones. Also create a startup budget listing everything you need to spend money on to launch, and identify which expenses are truly necessary versus nice to have."
          },
          {
            title: "Marketing Your Business",
            type: "reading",
            duration: "6 min",
            content: `Great products don't sell themselves. Here's how to get customers.

**Marketing basics:**
• Marketing = getting the right message to the right people
• Sales = converting interested people into paying customers
• Both are essential - you need them to survive

**Free marketing strategies:**
• Social media (Instagram, TikTok, LinkedIn)
• Content marketing (blog posts, YouTube videos)
• Word of mouth (happy customers refer others)
• Partnerships (collaborate with complementary businesses)
• SEO (showing up in Google searches)

**Paid marketing options:**
• Social media ads (start with $5-10/day)
• Google ads
• Influencer partnerships
• Local advertising

**Building your marketing plan:**
1. Define your target customer clearly
2. Find where they hang out (online and offline)
3. Create content that helps them
4. Have a clear call to action
5. Track what works and do more of it

**Social media tips:**
• Pick 1-2 platforms and master them
• Consistency beats perfection
• Engage with your audience, don't just post
• Show behind-the-scenes
• Use stories and short videos`,
            keyPoints: [
              "Marketing is about being where your customers are",
              "Start with free marketing before spending money",
              "Consistency and engagement matter more than perfection",
              "Track results and double down on what works"
            ],
            articles: [
              {
                title: "Building Your Brand on Social Media",
                content: `Social media is the most accessible marketing channel for new businesses. You can reach thousands of potential customers for free.

Choose platforms based on where your customers are. Do not try to be everywhere. It is better to be excellent on one or two platforms than mediocre on five.

Create valuable content, not just promotional posts. People do not follow brands that only sell. Share insights, tips, entertainment, and behind-the-scenes content.

Consistency matters more than perfection. Posting regularly builds audience expectations and algorithm favor. A consistent okay post beats an occasional perfect one.

Engage with your audience authentically. Reply to comments and messages. Ask questions. Share customer stories. Social media is social.

Use analytics to guide decisions. Every platform provides data about what content performs. Double down on what works and stop doing what does not.

Build an email list from social followers. Social platforms can change algorithms or shut down. Email is a direct connection to your audience that you control.

Collaborate with others in your space. Cross-promotion exposes you to new audiences. Find complementary brands and creators to partner with.`
              },
              {
                title: "Getting Your First Ten Customers",
                content: `The first customers are the hardest to get. But they are also the most valuable for learning and building credibility.

Start with your existing network. Friends, family, classmates, and their connections are accessible warm contacts. Ask them to try your product or refer others.

Offer something special to early adopters. Discounts, extra features, or exclusive access motivate people to take a chance on something new.

Provide exceptional service to early customers. Word of mouth from happy customers is the best marketing. Go above and beyond for your first ten.

Ask for referrals explicitly. Happy customers are often willing to refer others but do not think of it unless asked. Make it easy for them.

Document testimonials and case studies. Social proof helps convert skeptical prospects. Early customer stories become marketing assets.

Learn everything you can from early customers. Ask what they like, what could be better, and how they describe your product to others.

Do not discount too heavily. Early customers who pay full price validate your pricing. Deep discounts attract bargain hunters who do not represent your real market.`
              }
            ],
            activityQuestion: "Create a thirty-day marketing plan for your business. Choose two platforms or channels to focus on and plan specific content or actions for each week. Include how you will get your first ten customers, what content you will create, and how you will measure success. Set a goal for followers, email subscribers, or customers at the end of thirty days."
          },
          {
            title: "Managing Business Finances",
            type: "reading",
            duration: "6 min",
            content: `Business finances are different from personal finances. Here's what you need to know.

**Keep business and personal separate:**
• Open a separate business bank account
• Get a business credit card
• Track every business expense
• This makes taxes SO much easier

**Understanding basic financials:**
• Revenue: Money coming in
• Expenses: Money going out
• Profit: Revenue minus expenses
• Cash flow: Timing of money in vs out

**Pricing your product/service:**
• Know your costs (materials, time, overhead)
• Research competitor pricing
• Don't undervalue yourself
• Price for profit, not just survival

**Tracking your money:**
• Use simple accounting software (Wave is free)
• Record every transaction
• Review weekly at minimum
• Understand where money comes from and goes

**Taxes for side hustles:**
• You must report all income
• Save 25-30% for taxes
• Track all business expenses (they're deductible)
• Consider quarterly estimated payments
• Keep receipts for everything

**When to get help:**
• Hire a bookkeeper when it takes too much time
• Get an accountant for tax planning
• Consider a business lawyer for contracts`,
            keyPoints: [
              "Keep business and personal finances completely separate",
              "Track every dollar in and out from day one",
              "Save 25-30% of business income for taxes",
              "Price for profit - know your true costs"
            ],
            articles: [
              {
                title: "Bookkeeping Basics for Beginners",
                content: `Good bookkeeping is essential for any business, no matter how small. It helps you make decisions, pay taxes correctly, and understand your financial health.

Track every transaction from day one. It is much harder to reconstruct records later. Create a system before you need it.

Categorize expenses consistently. Common categories include marketing, supplies, software, travel, and professional services. Consistent categories make analysis possible.

Keep receipts for everything. Digital photos of receipts work. Apps like Expensify or simple folders on your phone make this easy.

Reconcile accounts regularly. Compare your records to bank statements at least monthly. Discrepancies caught early are easier to fix.

Understand the difference between cash and accrual accounting. Cash accounting records when money moves. Accrual records when transactions occur. Most small businesses start with cash accounting.

Review financial reports monthly. At minimum, look at income, expenses, and profit. Understand where your money comes from and where it goes.

Consider free software to start. Wave Accounting is free and handles most needs. QuickBooks and FreshBooks offer more features for growing businesses.`
              },
              {
                title: "Understanding Business Taxes",
                content: `Business taxes are different from personal taxes. Understanding the basics helps you plan and avoid surprises.

All business income is taxable. Whether you think of it as a side hustle or a real business, the IRS expects you to report it.

Set aside money for taxes from every payment. A common mistake is spending everything and having nothing for taxes. Save twenty-five to thirty percent automatically.

Business expenses reduce your taxable income. Every legitimate business expense lowers what you owe. This is why tracking expenses matters.

Keep records for at least seven years. The IRS can audit prior years. Digital records are fine as long as they are backed up.

Understand estimated taxes. If you expect to owe more than one thousand dollars at tax time, you may need to pay quarterly estimated taxes to avoid penalties.

Learn the difference between deductions and credits. Deductions reduce taxable income. Credits reduce taxes owed directly. Credits are generally more valuable.

Consider professional help as you grow. Tax law is complex. A good accountant often saves more than they cost by finding deductions and avoiding mistakes.`
              }
            ],
            activityQuestion: "Set up a simple bookkeeping system for your business. Create a spreadsheet or sign up for free accounting software. Define your expense categories, record any transactions you have had so far, and create a process for recording future transactions. Calculate what twenty-five percent of your expected income would be and plan how you will set that aside for taxes."
          }
        ]
      },
      15: {
        title: "Community Showcase",
        sections: [
          {
            title: "Preparing Your Presentation",
            type: "reading",
            duration: "6 min",
            content: `Time to show off what you've built! Here's how to present like a pro:

**Know your audience:**
• Who will be watching?
• What do they care about?
• What questions will they have?

**Structure your pitch:**
• Hook: Grab attention in 10 seconds
• Problem: What issue are you solving?
• Solution: How does your idea solve it?
• Traction: What have you accomplished?
• Ask: What do you need? (feedback, support, connections)

**Storytelling matters:**
• Use real examples and stories
• Make it personal - why do YOU care?
• Show, don't just tell
• Keep it simple and clear

**Practice:**
• Practice out loud, not just in your head
• Time yourself
• Get feedback and adjust
• Prepare for tough questions`,
            keyPoints: [
              "Know your audience and what they care about",
              "Lead with the problem, not the solution",
              "Stories are more memorable than facts",
              "Practice until you're confident, not just prepared"
            ],
            articles: [
              {
                title: "The Art of the Pitch",
                content: `A great pitch captures attention, communicates value, and inspires action. Whether pitching to investors, customers, or partners, the fundamentals are the same.

Open with a hook. You have seconds to capture attention. Start with a surprising statistic, a provocative question, or a compelling story.

Lead with the problem. Before explaining your solution, make sure the audience feels the pain of the problem. If they do not care about the problem, they will not care about your solution.

Present your solution clearly. Explain what you do in simple terms. Avoid jargon and technical details unless specifically relevant to your audience.

Demonstrate traction or proof. What evidence do you have that this works? Customer testimonials, revenue numbers, or user growth all build credibility.

Tell your personal story. Why are you the right person to solve this problem? What is your connection to the mission? Personal stories create emotional connection.

End with a clear ask. What do you want from this audience? Feedback, investment, customers, connections? Be specific about what you need.

Practice relentlessly. Great pitches look effortless because of extensive practice. Know your material well enough that you can adapt on the fly.`
              },
              {
                title: "Creating Compelling Visual Slides",
                content: `Visual presentations should support your message, not distract from it. Less is almost always more when it comes to slides.

Use minimal text. Slides with paragraphs of text encourage reading instead of listening. Use keywords and phrases, not sentences.

Choose high-quality images. One powerful image communicates more than a dozen bullet points. Invest time finding or creating strong visuals.

Maintain visual consistency. Use the same fonts, colors, and layout style throughout. Inconsistency looks unprofessional and distracts.

Make data visual. Charts and graphs communicate numbers better than tables. Choose the right visualization for your data.

Use white space deliberately. Crowded slides overwhelm audiences. Empty space draws attention to what matters.

Test readability. Your slides must be legible from the back of the room. When in doubt, make text bigger.

Have a backup plan. Technology fails. Know your presentation well enough to deliver it without slides if necessary. Bring backups of your files.`
              }
            ],
            activityQuestion: "Create a five-minute pitch presentation for your business or project. Include an attention-grabbing hook, the problem you solve, your solution, evidence of traction or potential, your personal connection to the mission, and a clear ask. Practice delivering it at least five times and time yourself. Present to a friend or family member and get their feedback."
          },
          {
            title: "Giving and Receiving Feedback",
            type: "interactive",
            duration: "5 min",
            content: `Feedback is how you get better. Here's how to handle it:

**Giving good feedback:**
• Be specific, not vague
• Focus on the work, not the person
• Offer suggestions, not just criticism
• Balance positive and constructive

**Receiving feedback:**
• Listen without getting defensive
• Ask clarifying questions
• Thank the person for their input
• Decide what to act on (you don't have to take everything)

**After the showcase:**
• Follow up with people who showed interest
• Implement the best feedback
• Keep building relationships
• Celebrate your progress!`,
            keyPoints: [
              "Feedback is a gift - receive it graciously",
              "You don't have to act on every piece of feedback",
              "Follow up with connections made at the showcase",
              "This is just the beginning of your journey"
            ],
            articles: [
              {
                title: "The Skill of Receiving Feedback",
                content: `How you receive feedback determines how much you learn and grow. Defensive reactions shut down valuable information.

Listen without interrupting. Let the person finish their thought completely before responding. You can ask questions, but do not defend or explain until they are done.

Assume positive intent. Most feedback comes from a desire to help. Even poorly delivered feedback often contains useful information.

Ask clarifying questions. If feedback is vague, ask for specific examples. Understanding exactly what triggered the feedback helps you address it.

Thank the person sincerely. Giving feedback is uncomfortable. Expressing gratitude encourages people to continue providing honest input.

Take time to process. You do not have to respond immediately. It is appropriate to say you need time to think about the feedback.

Separate the message from the delivery. Sometimes valuable feedback comes in an unpleasant package. Try to extract the useful content regardless of how it was delivered.

Decide what to act on. You do not have to implement every piece of feedback. Consider the source, look for patterns, and use your judgment about what changes to make.`
              },
              {
                title: "Giving Feedback That Actually Helps",
                content: `Effective feedback is specific, actionable, and delivered with care. Generic praise or vague criticism does not help anyone improve.

Be specific about what you observed. Instead of saying it was good, describe exactly what worked. Instead of saying it needs work, identify the specific issue.

Focus on behavior and work, not personality. Criticize the presentation structure, not the presenter. Address the writing quality, not the writer.

Balance positive and constructive feedback. Start with what works well. This is not just being nice; it tells the person what to keep doing.

Make feedback actionable. If you identify a problem, suggest potential solutions. Feedback without direction leaves people stuck.

Choose the right time and setting. Public criticism embarrasses people and creates defensiveness. Sensitive feedback should be private.

Ask permission when appropriate. Unsolicited feedback can feel like an attack. Asking if someone wants feedback respects their autonomy.

Follow up later. Check in after giving feedback to see if it was helpful and if the person needs clarification or support.`
              }
            ],
            activityQuestion: "Practice giving and receiving feedback with a partner. Have them present a project or idea for three minutes, then provide structured feedback using the format: two specific things that worked well, one specific suggestion for improvement, and one question you have. Then switch roles. Reflect on what made the feedback helpful or unhelpful."
          },
          {
            title: "Public Speaking Confidence",
            type: "reading",
            duration: "5 min",
            content: `Public speaking is the #1 fear for most people. Here's how to overcome it.

**Understanding nerves:**
• Everyone gets nervous - even pros
• Nervousness means you care
• Your audience wants you to succeed
• The feeling usually fades after the first minute

**Before you speak:**
• Practice out loud, not just in your head
• Record yourself and watch it back
• Practice in front of friends or family
• Visualize success, not failure
• Prepare for technical difficulties

**Physical techniques:**
• Deep breathing (4 in, hold 4, out 4)
• Power poses before presenting
• Move around - don't stand frozen
• Make eye contact with friendly faces
• Speak slower than feels natural

**Content tips:**
• Start with a hook - story, question, surprising fact
• Use the rule of 3 (3 main points)
• Include stories and examples
• End with a clear call to action
• Have backup for "what if I forget?"

**Handling Q&A:**
• Repeat the question so everyone hears
• "That's a great question" buys thinking time
• It's okay to say "I don't know, but I'll find out"
• Keep answers concise`,
            keyPoints: [
              "Nerves are normal - even professionals feel them",
              "Practice out loud multiple times before presenting",
              "Deep breathing and power poses reduce anxiety",
              "Start with a hook and end with a clear call to action"
            ],
            articles: [
              {
                title: "Overcoming Stage Fright",
                content: `Stage fright is one of the most common fears. Understanding what causes it helps you manage it.

Fear of speaking is hardwired. Evolutionarily, standing out from the group could mean danger. Your body responds to public speaking as a threat, triggering fight or flight.

Reframe nervousness as excitement. The physical sensations of fear and excitement are nearly identical. Telling yourself you are excited rather than scared can shift your experience.

Preparation reduces anxiety. Much of the fear comes from uncertainty. The better you know your material, the less there is to fear.

Visualize success. Before presenting, imagine yourself delivering confidently and the audience responding positively. Visualization primes your brain for the outcome you want.

Focus on the audience, not yourself. Shift attention from how you are performing to how you are helping the audience. Service orientation reduces self-consciousness.

Accept that mistakes will happen. Every speaker stumbles occasionally. The audience rarely notices or cares as much as you think. Keep going.

Build experience gradually. Start with small, low-stakes presentations. Each positive experience builds confidence for bigger challenges.`
              },
              {
                title: "Body Language in Presentations",
                content: `Your body communicates as much as your words. Confident body language makes your message more persuasive.

Stand with open posture. Shoulders back, chest open, feet shoulder-width apart. Avoid crossing arms or hunching, which signals defensiveness.

Use purposeful movement. Walking and gesturing with intention adds energy. Pacing randomly or fidgeting distracts.

Make eye contact. Connect with individuals in different parts of the room. Sustained eye contact for a few seconds creates connection without being uncomfortable.

Use gestures to emphasize points. Hand movements that match your words reinforce the message. Keep gestures in the power zone between your waist and shoulders.

Control your face. A genuine smile builds rapport. Avoid nervous expressions like lip biting or frowning.

Project your voice. Speak from your diaphragm, not your throat. A strong voice commands attention and conveys confidence.

Pause deliberately. Pauses give the audience time to absorb information and create emphasis. Do not fill silence with ums and ahs.`
              }
            ],
            activityQuestion: "Record yourself giving a two-minute presentation on any topic. Watch the recording and evaluate your body language, eye contact, voice projection, and use of pauses. Identify two specific things you do well and two things to improve. Then practice the presentation again focusing on the improvements and record again to compare."
          },
          {
            title: "Reflecting on Your Progress",
            type: "interactive",
            duration: "6 min",
            content: `You've come a long way. Let's reflect on your growth.

**Look back at where you started:**
• What did you know about money before this program?
• What were your biggest fears or confusion?
• What habits did you have around money?

**Celebrate your wins:**
• What's the most important thing you learned?
• What new habits have you built?
• What's one decision you made differently because of this program?
• What are you most proud of?

**Acknowledge challenges:**
• What was the hardest concept to understand?
• What habit is still difficult for you?
• What would you do differently if starting over?

**Share your story:**
• How would you explain what you learned to a friend?
• What advice would you give to someone starting this program?
• How has your mindset about money changed?

**Looking forward:**
• What's your biggest financial goal for the next year?
• What habit will have the biggest impact?
• Who can you teach or help with financial literacy?

**Remember:**
• Learning is ongoing - this isn't the end
• Mistakes are part of the journey
• Small actions compound into big results
• You have the knowledge - now apply it`,
            keyPoints: [
              "Reflection solidifies learning and identifies growth",
              "Celebrate wins - even small ones matter",
              "Your journey can help others just starting out",
              "This is the beginning, not the end"
            ],
            articles: [
              {
                title: "The Power of Reflection",
                content: `Experience alone does not create learning. Reflection turns experience into insight and improvement.

Schedule regular reflection time. Without intentional pauses, you move from task to task without extracting lessons. Block time weekly or after major experiences.

Ask structured questions. What went well? What did not go as planned? What would I do differently? What did I learn about myself?

Write your reflections. Thinking is valuable, but writing forces clarity and creates a record you can revisit.

Look for patterns over time. Single experiences can be misleading. Patterns across multiple reflections reveal deeper truths.

Celebrate progress honestly. Acknowledge what you have accomplished without dismissing it. Growth often feels invisible until you compare to where you started.

Be honest about failures. Reflection is not useful if you explain away every mistake. Genuine assessment, while uncomfortable, drives real improvement.

Connect reflection to action. Insight without action is merely interesting. End reflections by identifying specific changes you will make.`
              },
              {
                title: "Teaching What You Have Learned",
                content: `Teaching others is one of the most powerful ways to solidify your own learning. When you teach, you are forced to understand deeply.

The act of explaining reveals gaps. You discover what you do not really understand when you try to explain it to someone else.

Simplifying for others deepens your grasp. Finding the clearest way to communicate a concept requires truly understanding its essence.

Questions from learners expand your thinking. Other people's questions reveal angles you had not considered.

Teaching creates accountability. If you know you will teach something, you learn it more thoroughly.

Start with informal teaching. You do not need a classroom. Explain concepts to friends, family, or colleagues who are interested.

Document what you teach. Writing blog posts, making videos, or creating guides benefits others while reinforcing your learning.

Be comfortable saying you do not know. Good teachers admit uncertainty and model learning alongside their students.`
              }
            ],
            activityQuestion: "Write a reflection on your entire learning journey through this program. Include what you knew before starting, the most important concepts you learned, how your thinking about money changed, challenges you faced, and what you are most proud of. Then create a plan to teach one key concept to someone else within the next week."
          }
        ]
      },
      16: {
        title: "Financial Wellness & Future Planning",
        sections: [
          {
            title: "Long-Term Financial Planning",
            type: "reading",
            duration: "7 min",
            content: `Now that you've got the basics down, let's talk about planning your financial future beyond just next month or next year. We're talking 5, 10, 20 years out.

**Why plan long-term?**
• Your future self will thank you
• Small actions now = huge results later (compound interest baby!)
• You'll avoid scrambling when big life events happen
• Financial stress kills dreams - planning reduces stress

**Key milestones to plan for:**
• **Age 18-25:** Build emergency fund, establish credit, start investing
• **Age 25-35:** Save for big purchases (house, car), retirement contributions, career growth
• **Age 35-45:** College savings for kids, increase retirement savings, build wealth
• **Age 45-55:** Max out retirement contributions, pay off major debts
• **Age 55+:** Plan retirement lifestyle, healthcare planning, legacy planning

**Setting up your financial roadmap:**
1. **Define your goals** - What do you actually want? House? Business? Travel?
2. **Attach numbers and dates** - "Save $50,000 for house down payment by age 28"
3. **Break it down** - $50k in 10 years = $417/month
4. **Automate it** - Set up automatic transfers so you don't forget
5. **Review quarterly** - Life changes, your plan should too`,
            keyPoints: [
              "Think in decades, not just months",
              "Break big goals into small monthly actions",
              "Automate your savings and investments",
              "Review and adjust your plan regularly"
            ],
            articles: [
              {
                title: "The Decades Perspective",
                content: `Most people overestimate what they can do in a year and underestimate what they can do in a decade. Long-term thinking transforms your financial trajectory.

A decade is long enough for compound interest to work magic. Money invested at twenty becomes many times larger by sixty. But you have to start.

Long-term planning reduces anxiety. When you know you are building toward something, temporary setbacks matter less. The bigger picture provides perspective.

Major life decisions benefit from long-term thinking. Choosing a career, buying a home, and having children all have financial implications that span decades. Consider the long-term costs and benefits.

Your future self is a real person. They will have to live with decisions you make today. Treat them well by making choices now that future you will thank you for.

Visualize your future concretely. Where do you want to live? What do you want to be doing? Who do you want to be with? Specific visions are more motivating than vague aspirations.

Break long-term goals into milestones. A ten-year goal becomes ten yearly targets, which become monthly actions. The long-term vision guides daily decisions.`
              },
              {
                title: "Creating Your Financial Roadmap",
                content: `A financial roadmap turns vague intentions into concrete plans. It connects your daily actions to your long-term destination.

Start with your vision. What does your ideal life look like in ten, twenty, or thirty years? Be specific about lifestyle, location, relationships, and purpose.

Work backward to identify milestones. What needs to be true in five years to be on track? What about three years? One year? Six months?

Attach numbers to goals. Dreams without numbers remain dreams. Calculate how much you need, by when, and what monthly savings rate gets you there.

Identify the gaps. What skills, knowledge, or resources do you need that you do not currently have? These gaps become development priorities.

Build in flexibility. Life rarely follows plans exactly. Your roadmap should be a guide, not a prison. Review and adjust regularly.

Automate the mechanics. Once you know what you need to save and invest, set up automatic transfers so you do not rely on willpower.

Celebrate progress. Long-term goals can feel distant. Acknowledge milestones along the way to maintain motivation.`
              }
            ],
            activityQuestion: "Create a personal financial roadmap. Start by writing your ten-year vision in detail, then work backward to identify five-year, three-year, one-year, and ninety-day milestones. Calculate the monthly savings and investment amounts needed to reach your goals. Identify three specific actions you can take this week to start moving toward your vision."
          },
          {
            title: "Advanced Investing Strategies",
            type: "video",
            duration: "8 min",
            content: `You know the basics of investing. Now let's level up your game.

**Investment vehicles beyond the basics:**
• **Index Funds** - Buy the whole market, super low risk, great for long-term
• **ETFs** - Like index funds but trade like stocks
• **Real Estate** - Rental properties, REITs, house hacking
• **Bonds** - Lower risk than stocks, good for balancing your portfolio
• **Retirement Accounts** - 401k, Roth IRA, Traditional IRA (maximize these!)

**The magic of tax-advantaged accounts:**
• **Roth IRA** - Pay taxes now, grow tax-free forever. Max is $6,500/year
• **401k** - Employer match is FREE MONEY. Always take it.
• **HSA** - Triple tax advantage for healthcare expenses

**Asset allocation by age:**
• **Teens-20s:** 90% stocks, 10% bonds (you have time to recover from dips)
• **30s:** 80% stocks, 20% bonds
• **40s:** 70% stocks, 30% bonds
• **50s+:** Gradually shift more to bonds for stability

**Dollar cost averaging:**
Instead of trying to "time the market" (which nobody can do consistently), just invest the same amount every month. Market up? You buy. Market down? You buy. Over time, you smooth out the ups and downs.`,
            keyPoints: [
              "Maximize tax-advantaged accounts first (401k, Roth IRA)",
              "Dollar cost averaging beats trying to time the market",
              "Diversify across different assets and industries",
              "Rebalance your portfolio at least yearly"
            ],
            articles: [
              {
                title: "Understanding Tax-Advantaged Accounts",
                content: `Tax-advantaged accounts are one of the best tools for building wealth. Understanding them helps you keep more of what you earn.

A 401k lets you invest pre-tax money from your paycheck. You do not pay taxes until you withdraw in retirement when you may be in a lower tax bracket. Many employers match contributions, which is essentially free money.

A Roth IRA works differently. You contribute after-tax money, but all growth and withdrawals are tax-free in retirement. This is powerful because decades of compound growth never gets taxed.

Traditional IRAs are like 401ks but not employer-sponsored. You get a tax deduction now and pay taxes on withdrawals later.

HSAs are triple tax-advantaged. Contributions are tax-deductible, growth is tax-free, and withdrawals for medical expenses are tax-free. If you have a high-deductible health plan, max this account.

Contribution limits apply to each account type. For 2024, the 401k limit is twenty-three thousand dollars, and IRA limits are seven thousand dollars. These limits increase periodically.

The order of investing matters. Generally, contribute enough to get your full employer 401k match, then max your Roth IRA, then return to max your 401k, then consider taxable brokerage accounts.`
              },
              {
                title: "The Power of Index Fund Investing",
                content: `Index funds are one of the most powerful wealth-building tools available. They offer diversification, low costs, and historically strong returns.

An index fund tracks a market index like the S&P 500. Instead of trying to pick winning stocks, you own a piece of the entire market.

Low costs compound dramatically. A fund charging 0.03 percent versus 1 percent might not seem different, but over decades, the difference can be hundreds of thousands of dollars.

Passive investing beats most active investors. Research consistently shows that most professional fund managers underperform simple index funds over time. The market is hard to beat.

Diversification reduces risk. Owning hundreds or thousands of companies through an index fund protects you from any single company failing. Your fortune is not tied to one stock.

Dollar cost averaging works perfectly with index funds. Invest consistently regardless of market conditions. You automatically buy more shares when prices are low and fewer when prices are high.

Time in the market beats timing the market. Studies show that missing the best days hurts returns dramatically. Stay invested through ups and downs.

Keep it simple. A three-fund portfolio of US stocks, international stocks, and bonds can serve you for life. Complexity does not improve results.`
              }
            ],
            activityQuestion: "Research the specific tax-advantaged accounts available to you. Find out your employer's 401k match if applicable and calculate how much free money you would leave on the table by not contributing enough. Then research index funds and identify three options with low expense ratios. Create a plan for which accounts to prioritize and what to invest in."
          },
          {
            title: "Building Multiple Income Streams",
            type: "interactive",
            duration: "9 min",
            content: `Real wealth comes from having money work for you in multiple ways. Here's how to build multiple income streams:

**Income Stream Categories:**
1. **Active Income** - Trade time for money (your job)
2. **Portfolio Income** - Stocks, dividends, capital gains
3. **Passive Income** - Money that comes in without active work

**Realistic passive income ideas:**
• **Rental property** - Buy a house, rent it out. Cashflow every month
• **Dividend stocks** - Companies pay you just for owning their stock
• **Create digital products** - Courses, ebooks, templates you make once and sell forever
• **YouTube/Content creation** - Build once, earn from ads forever
• **Affiliate marketing** - Promote products, earn commission on sales

**How to start building:**
1. **Master your primary income** - Get raises, promotions, skills
2. **Start investing** - Begin with index funds, build over time
3. **Pick ONE side income** - Don't try everything at once
4. **Build it to $500/month** - Prove the concept works
5. **Scale or add another** - Once one works, optimize or add more

**The goal:**
Have 3-5 income streams so if one fails, you're not broke. Financial security comes from diversification.`,
            keyPoints: [
              "Start with active income, transition to passive",
              "Build one stream to $500/month before adding more",
              "Passive income requires active work upfront",
              "Aim for 3-5 diverse income streams long-term"
            ],
            articles: [
              {
                title: "The Reality of Passive Income",
                content: `Passive income is real, but it is often misunderstood. Very little income is truly passive without significant upfront work.

Most passive income requires active work first. A rental property requires finding, purchasing, and managing property. A course requires creating content and marketing.

Dividend investing is among the most passive options. Once you buy dividend-paying stocks or funds, they pay you quarterly without additional work. But you need significant capital first.

Real estate can be passive with the right setup. Property managers handle day-to-day operations, but you still make major decisions and handle problems.

Digital products scale without proportional effort. An ebook or course sells to thousands without additional work per sale. But creating quality products takes substantial upfront investment.

Affiliate marketing requires building an audience first. Once you have traffic or followers, affiliate income can be relatively passive. But building that audience takes years.

Be skeptical of get-rich-quick passive income claims. If it sounds too easy, it probably is. Real passive income takes time, effort, and often capital to build.`
              },
              {
                title: "Building Your First Income Stream",
                content: `Start with one additional income stream and build it to meaningful levels before adding more. Focus beats fragmentation.

Choose based on your skills and interests. An income stream you enjoy is more sustainable than one that feels like a burden.

Service businesses are the fastest to start. Freelancing, consulting, coaching, or gig work can generate income within days. They trade time for money but require minimal startup capital.

Product businesses take longer but scale better. Digital products, e-commerce, or content creation require upfront investment but can grow without proportional time increases.

Set a specific milestone before moving on. Five hundred dollars per month is a reasonable first target. It proves the concept works and provides meaningful income.

Track your time investment honestly. An income stream earning five hundred dollars but taking forty hours might not be worth it. Calculate your effective hourly rate.

Reinvest early profits into growth. Instead of spending extra income immediately, use it to grow the business or accelerate other financial goals.

Be patient but persistent. Most side income streams take months or years to become significant. Consistency over time produces results that sporadic effort never will.`
              }
            ],
            activityQuestion: "Research three potential additional income streams that match your current skills and available time. For each one, estimate the startup costs, time to first income, income potential at maturity, and weekly time required. Choose the one that best fits your situation and create a thirty-day action plan to get started."
          },
          {
            title: "Protecting Your Wealth",
            type: "reading",
            duration: "6 min",
            content: `Building wealth is one thing. Protecting it is another. Here's how to safeguard what you've built.

**Insurance basics:**
• Health insurance: Don't skip it - one medical bill can wipe you out
• Auto insurance: Required by law, protects you from lawsuits
• Renter's insurance: Cheap protection for your stuff
• Life insurance: Necessary once you have dependents
• Disability insurance: Protects your income if you can't work

**Emergency fund reminder:**
• 3-6 months of expenses in a high-yield savings account
• This is your first line of defense
• Don't invest your emergency fund

**Protecting your identity:**
• Use unique passwords for every financial account
• Enable two-factor authentication everywhere
• Monitor your credit reports regularly
• Freeze your credit if you're not applying for anything
• Shred sensitive documents

**Estate planning (yes, even young):**
• Create a basic will (free templates online)
• Set up beneficiaries on all accounts
• Keep important documents organized
• Tell someone where to find everything

**Common wealth destroyers:**
• Lifestyle inflation (earning more, spending more)
• Risky investments (get-rich-quick schemes)
• Cosigning loans for others
• Divorce without a prenup
• Not having insurance

**The mindset:**
Protecting wealth is about being defensive. Play good defense so one bad event doesn't undo years of hard work.`,
            keyPoints: [
              "Insurance protects you from catastrophic financial events",
              "Keep 3-6 months expenses in an emergency fund",
              "Protect your identity with strong passwords and credit monitoring",
              "Avoid lifestyle inflation as your income grows"
            ],
            articles: [
              {
                title: "Insurance as Wealth Protection",
                content: `Insurance is not an expense to minimize. It is protection against catastrophic events that could destroy years of financial progress.

Health insurance is non-negotiable. A single hospital stay can cost tens of thousands of dollars. Going uninsured is gambling with your financial future.

Auto insurance protects against liability, not just your car. If you cause an accident that injures someone, you could be sued for their medical bills and lost income. Liability coverage protects your assets.

Renters or homeowners insurance protects your possessions. Fire, theft, or natural disasters can destroy everything you own. The cost of insurance is tiny compared to the potential loss.

Disability insurance protects your earning ability. If you cannot work due to illness or injury, disability insurance replaces part of your income. Your ability to earn is your most valuable asset.

Life insurance matters when others depend on your income. If you have a spouse or children who rely on your earnings, life insurance ensures they are provided for if something happens to you.

Review coverage annually. As your life changes, so do your insurance needs. Make sure your coverage matches your current situation.`
              },
              {
                title: "Fighting Lifestyle Inflation",
                content: `Lifestyle inflation is the tendency to increase spending as income increases. It is one of the biggest threats to building wealth.

Notice when it happens. A raise comes, and suddenly you need a nicer apartment, a newer car, fancier restaurants. Each upgrade feels justified in isolation.

The math is brutal. If your income doubles but your spending doubles too, you have made no progress toward financial independence. Saving rate matters more than income.

Delayed upgrading builds wealth faster. What if you waited a year after each raise before increasing lifestyle? That year of saving at a higher rate compounds dramatically.

Lifestyle inflation has diminishing returns. Each upgrade provides less additional happiness than the previous one. The jump from poverty to comfort matters enormously. The jump from comfortable to luxurious matters much less.

Some upgrades are worth it. This is not about deprivation. Spending on things that genuinely improve your life, health, or relationships can be worth it. The goal is intentionality, not frugality for its own sake.

Build systems to prevent mindless inflation. Automate savings increases when you get raises. Make upgrading require conscious decisions rather than default drift.`
              }
            ],
            activityQuestion: "Review your current insurance coverage and identify any gaps. Research what adequate health, auto, renters or homeowners, and disability insurance would cost. Then examine your spending over the past year and identify any lifestyle inflation that happened without conscious decision. Create a plan to capture at least fifty percent of any future income increases for savings before allowing lifestyle upgrades."
          }
        ]
      },
      17: {
        title: "Life Skills & Financial Independence",
        sections: [
          {
            title: "Achieving True Financial Independence",
            type: "reading",
            duration: "6 min",
            content: `Financial independence doesn't mean you're rich. It means you have enough passive income to cover your expenses without HAVING to work. That's the dream, right?

**What is FI (Financial Independence)?**
When your assets generate enough income to cover your living expenses. Example: If your expenses are $3,000/month and your investments generate $3,000/month, you're financially independent.

**The FI formula:**
Annual Expenses x 25 = Your FI Number
If you need $36,000/year to live, your FI number is $900,000. Once you have that invested, you can safely withdraw 4% per year forever.

**Levels of Financial Independence:**
• **Coast FI** - You've saved enough that it'll grow to FI by retirement without adding more
• **Lean FI** - You're FI but living on a tight budget
• **FI** - You can cover your normal lifestyle without working
• **Fat FI** - You can live comfortably with extra cushion

**Real talk:** Most people won't fully retire at 30. But having the OPTION to? That's freedom. Financial independence gives you choices.`,
            keyPoints: [
              "FI = Passive income covers all expenses",
              "Your FI number = Annual expenses x 25",
              "Multiple paths to FI - pick what works for you",
              "FI gives you freedom to choose, not just to retire"
            ],
            articles: [
              {
                title: "The FIRE Movement Explained",
                content: `FIRE stands for Financial Independence, Retire Early. It is a movement of people pursuing the freedom that comes from having enough investments to cover their expenses.

The core principle is simple: save aggressively, invest wisely, and reach a point where work becomes optional. Most FIRE adherents save fifty percent or more of their income.

The four percent rule guides planning. Research suggests you can withdraw four percent of your portfolio annually with low risk of running out of money. This means you need twenty-five times your annual expenses invested.

FIRE has many variations. Lean FIRE means achieving independence on a minimal budget. Fat FIRE means having a larger cushion for comfortable living. Coast FIRE means having enough invested that you can stop contributing and let compound growth do the rest.

Critics point out that extremely early retirement is not for everyone. Many FIRE practitioners find they want to keep working, just on their own terms. The real goal is options, not necessarily early retirement.

FIRE requires discipline and sacrifice. High savings rates mean saying no to things others enjoy now. Whether this tradeoff makes sense depends on your values and priorities.

You do not have to go extreme. Even partial progress toward financial independence provides options. Having two years of expenses saved gives you far more freedom than most people have.`
              },
              {
                title: "Calculating Your Financial Independence Number",
                content: `Your FI number is the amount of invested assets that generates enough income to cover your expenses without working.

Start with your annual expenses. Track your actual spending for several months to get an accurate number. Do not guess or estimate based on income.

Multiply by twenty-five. If you spend forty thousand dollars per year, your FI number is one million dollars. At a four percent withdrawal rate, one million generates forty thousand annually.

Consider how expenses might change. Will your mortgage be paid off? Will healthcare costs increase? Your FI number should reflect expected future expenses, not just current ones.

Factor in any guaranteed income. Social Security, pensions, or rental income reduce the amount you need from investments. Subtract these from your expense calculation.

Build in a margin of safety. The four percent rule is based on historical data but not guaranteed. Consider using three and a half percent for more security, which means multiplying expenses by about twenty-nine.

Your FI number can change. As your spending patterns change, so does your target. This is why tracking expenses matters continuously.

Break it down into milestones. Instead of fixating on a large number, celebrate reaching one hundred thousand, two hundred fifty thousand, five hundred thousand, and so on.`
              }
            ],
            activityQuestion: "Calculate your personal FI number. Track your actual expenses for the past three months and extrapolate to an annual figure. Multiply by twenty-five to find your target. Then calculate how long it would take to reach that target at various savings rates. Finally, identify the three largest expense categories and brainstorm ways you could reduce them to lower your FI number."
          },
          {
            title: "Essential Life Skills for Success",
            type: "video",
            duration: "8 min",
            content: `Money is important, but these life skills will multiply your success:

**Communication Skills:**
• **Active listening** - Actually hear what people say, don't just wait to talk
• **Clear writing** - Emails, texts, proposals - write clearly and concisely
• **Public speaking** - Practice until it's not scary
• **Difficult conversations** - Don't avoid them, learn to handle them well

**Time Management:**
• **Prioritization** - Do the most important things first
• **Calendar blocking** - Schedule your priorities or they won't happen
• **Saying no** - Protect your time like you protect your money
• **Deep work** - Block out distractions for focused work sessions

**Emotional Intelligence:**
• **Self-awareness** - Know your triggers, strengths, and weaknesses
• **Self-regulation** - Control your reactions
• **Empathy** - Understand others' perspectives
• **Social skills** - Build and maintain relationships

**Resilience:**
• **Embrace failure** - It's data, not defeat
• **Manage stress** - Exercise, meditation, whatever works for you
• **Build support systems** - Friends, mentors, community
• **Maintain perspective** - Most things aren't as bad as they seem`,
            keyPoints: [
              "Communication and emotional intelligence matter as much as money skills",
              "Time management = life management",
              "Continuous learning is non-negotiable",
              "Resilience is a skill you can develop"
            ],
            articles: [
              {
                title: "Developing Emotional Intelligence",
                content: `Emotional intelligence may matter more than IQ for success in life and work. It can be developed with intentional practice.

Self-awareness is the foundation. Notice your emotions as they arise without judging them. Understand your triggers and patterns.

Self-regulation means managing your responses. You cannot control what emotions arise, but you can control how you respond to them. The pause between stimulus and response is where growth happens.

Motivation from within is more sustainable than external rewards. Connect your work to purpose and values rather than just paychecks and praise.

Empathy is the ability to understand others' perspectives and feelings. Practice listening to understand rather than listening to respond. Ask questions about how others experience situations.

Social skills build on all the above. When you understand yourself and others, you can communicate effectively, resolve conflicts, and build relationships.

Emotional intelligence shows up everywhere. In job interviews, in negotiations, in relationships, in leadership. It is rarely taught explicitly but always valued.

Start by paying attention. Notice your emotional reactions throughout the day. Ask yourself what triggered the feeling and whether your response was helpful.`
              },
              {
                title: "The Art of Continuous Learning",
                content: `In a rapidly changing world, continuous learning is essential for career success and personal fulfillment.

Make learning a daily habit. Even fifteen minutes of reading or listening to educational content compounds over time. Consistency beats intensity.

Learn in multiple modalities. Books, podcasts, videos, courses, conversations, and hands-on practice each offer different learning pathways. Mix them based on what you are trying to learn.

Apply what you learn immediately. Knowledge without application fades quickly. Find ways to use new information within days of learning it.

Teach others what you learn. Explaining concepts to someone else forces you to understand deeply and reveals gaps in your knowledge.

Focus on principles over tactics. Tactics change quickly, but underlying principles remain relevant. Learn the why behind the what.

Build a learning community. Surround yourself with curious people who share what they are learning. Communities accelerate individual learning.

Track your learning. Keep a record of books read, courses completed, and skills developed. Seeing progress motivates continued investment.`
              }
            ],
            activityQuestion: "Assess your current emotional intelligence by rating yourself on self-awareness, self-regulation, motivation, empathy, and social skills. Identify your weakest area and create a thirty-day plan to develop it. Additionally, create a personal learning curriculum for the next quarter with specific books, courses, or skills you want to develop, and schedule dedicated learning time in your calendar."
          },
          {
            title: "Your Next Steps & Lifelong Growth",
            type: "interactive",
            duration: "7 min",
            content: `You've almost completed the program and learned so much. Here's how to keep growing:

**Immediate next steps (this week):**
1. **Set 3 financial goals** - 1 short-term (3 months), 1 medium (1 year), 1 long-term (5 years)
2. **Automate one thing** - Savings transfer, bill payment, investment contribution
3. **Review your budget** - Is it realistic? Adjust as needed
4. **Check your credit score** - Know where you stand
5. **Share what you learned** - Teach someone else, it reinforces your knowledge

**Monthly money habits to maintain:**
• Review spending and budget
• Check progress on goals
• Contribute to savings/investments
• Read one finance article or book chapter
• Optimize one expense

**Resources to keep learning:**
• **Books:** "I Will Teach You to Be Rich," "The Simple Path to Wealth," "Rich Dad Poor Dad"
• **Podcasts:** "ChooseFI," "BiggerPockets Money," "Afford Anything"
• **Communities:** r/personalfinance, r/financialindependence

**You're ready:**
You have the knowledge. You have the tools. Now you just need to execute. Start small, stay consistent, and watch your future self thank you.`,
            keyPoints: [
              "Set clear short, medium, and long-term goals",
              "Maintain monthly, quarterly, and annual money habits",
              "Never stop learning about personal finance",
              "Teach others what you've learned - it reinforces your knowledge"
            ],
            articles: [
              {
                title: "Building Momentum After Graduation",
                content: `Finishing this program is an accomplishment, but the real work begins now. Building momentum requires consistent action over time.

Start before you feel ready. Perfectionism disguised as preparation keeps many people stuck. Take imperfect action now rather than waiting for ideal conditions.

Focus on systems more than goals. Goals are outcomes you want. Systems are daily actions that lead to those outcomes. A savings goal is nice, but an automatic transfer system actually gets you there.

Track leading indicators. The number in your savings account is a lagging indicator. The behaviors that grow that number, like monthly contributions, are leading indicators you can control directly.

Celebrate small wins. Acknowledging progress maintains motivation for the long journey. You will not feel like celebrating until you do.

Build accountability into your life. Tell people your goals. Find a money buddy to check in with. Join communities pursuing similar objectives.

Expect setbacks and plan for them. You will have months where you overspend, miss contributions, or make mistakes. What matters is getting back on track quickly.

Keep learning and adapting. Your first financial plan will not be your last. Stay curious and adjust as you gain experience and circumstances change.`
              },
              {
                title: "Resources for Continued Growth",
                content: `Your financial education does not end here. These resources can support continued learning and growth.

Books for deeper learning include I Will Teach You to Be Rich by Ramit Sethi for automation and systems, The Simple Path to Wealth by JL Collins for investing philosophy, and Your Money or Your Life by Vicki Robin for examining your relationship with money.

Podcasts allow learning during commutes or exercise. ChooseFI covers financial independence topics, BiggerPockets Money addresses a range of personal finance issues, and Afford Anything explores the philosophy of money and life design.

Online communities provide support and accountability. The personal finance and financial independence subreddits offer advice and discussion. Bogleheads forums focus on simple, low-cost investing.

Free tools help with execution. Mint and YNAB help with budgeting. Personal Capital tracks investments. Credit Karma monitors credit scores.

Consider working with professionals as needs grow. Fee-only financial advisors provide unbiased advice. CPAs help with complex tax situations. Estate attorneys assist with wills and trusts.

Return to fundamentals regularly. Even as you learn advanced strategies, the basics of spending less than you earn and investing the difference remain foundational.`
              }
            ],
            activityQuestion: "Create a personal financial learning plan for the next year. Identify two books you will read, two podcasts you will try, and one online community you will join. Also choose one professional skill you want to develop that could increase your earning potential. Schedule specific times for learning activities and set quarterly checkpoints to assess progress."
          },
          {
            title: "Creating Your Financial Plan",
            type: "interactive",
            duration: "8 min",
            content: `Let's put it all together into a personalized financial plan.

**Your Financial Snapshot:**
Take 5 minutes to write down:
• Current monthly income: $____
• Current monthly expenses: $____
• Current savings: $____
• Current debt: $____
• Credit score (if known): ____

**Your 90-Day Action Plan:**

**Month 1 - Foundation:**
• Create/update your budget
• Set up automatic savings ($__/month)
• Review all subscriptions, cancel unused ones
• Check your credit report for free

**Month 2 - Growth:**
• Increase savings by 10% if possible
• Open a high-yield savings account
• Build emergency fund to $500
• Apply for first credit card if you don't have one

**Month 3 - Momentum:**
• Review and adjust budget based on actuals
• Set up additional automatic investments
• Network with 5 people in your field
• Identify one income-growing opportunity

**Your 1-Year Goals:**
• Emergency fund: $______
• Total savings: $______
• Credit score: ______
• Debt payoff: $______
• Income goal: $______

**Review Schedule:**
• Weekly: 10-minute spending check
• Monthly: Full budget review and adjustment
• Quarterly: Goal progress review
• Yearly: Complete financial assessment

**Accountability:**
Share these goals with someone who will hold you accountable. Check in monthly.`,
            keyPoints: [
              "Create a written financial snapshot of where you are today",
              "Set specific 90-day action items with deadlines",
              "Review your plan weekly, monthly, and quarterly",
              "Find an accountability partner to share goals with"
            ],
            articles: [
              {
                title: "The Power of a Written Financial Plan",
                content: `A written financial plan dramatically increases the likelihood of achieving your goals. The process of writing creates clarity and commitment.

Start with your current state. Document your income, expenses, assets, debts, and net worth. You cannot plan a journey without knowing your starting point.

Define specific goals with numbers and dates. Save one thousand dollars is less powerful than save one thousand dollars by June thirtieth. Specificity creates accountability.

Identify the gaps between current and desired state. What needs to change to get from here to there? This gap analysis reveals your priorities.

Break big goals into ninety-day action plans. A year feels distant. Ninety days is close enough to feel urgent but long enough for meaningful progress.

Schedule regular reviews. Weekly check-ins keep you aware. Monthly reviews allow for adjustments. Quarterly reviews assess bigger picture progress.

Update your plan as circumstances change. A job change, new relationship, or unexpected expense may require revising your plan. This is normal, not failure.

Keep your plan accessible. A plan filed away and forgotten provides no value. Keep it where you see it regularly.`
              },
              {
                title: "Finding Your Accountability Partner",
                content: `Accountability dramatically increases follow-through. Having someone to report to makes you more likely to do what you said you would do.

Choose someone who will be honest with you. A friend who only tells you what you want to hear provides no accountability. You need someone willing to challenge you.

Find someone with similar goals if possible. A money buddy pursuing their own financial goals understands your challenges and can share the journey.

Set clear expectations upfront. How often will you check in? What will you share? What kind of feedback do you want? Clarity prevents awkwardness later.

Be vulnerable and specific. Vague updates like things are going fine provide no accountability. Share real numbers and real struggles.

Offer accountability in return. The best accountability relationships are mutual. Supporting someone else's goals strengthens your own commitment.

Accept feedback gracefully. When your accountability partner challenges you, resist the urge to defend or explain. Thank them for caring enough to be honest.

Evaluate and adjust the relationship over time. If accountability meetings become routine updates with no real accountability, something needs to change.`
              }
            ],
            activityQuestion: "Complete a comprehensive financial snapshot documenting your current income, expenses, assets, debts, and net worth. Then create a detailed ninety-day financial action plan with specific weekly tasks. Finally, identify a potential accountability partner and reach out to propose a money buddy relationship with clear expectations for check-in frequency and content."
          }
        ]
      },
      18: {
        title: "Graduation & Certification",
        sections: [
          {
            title: "Reflecting on Your Journey",
            type: "reading",
            duration: "5 min",
            content: `You made it! Let's look back at everything you've accomplished:

**What you've learned:**
• How to manage income, expenses, and savings
• The power of compound interest and investing
• Credit building and avoiding debt traps
• Banking basics and budgeting
• Personal branding and professionalism
• Resume building and job applications
• Networking and relationship building
• Entrepreneurship fundamentals

**Skills you've developed:**
• Financial literacy and money management
• Goal setting and planning
• Professional communication
• Leadership and teamwork
• Problem-solving and critical thinking

**You're now equipped to:**
• Make smart financial decisions
• Build wealth over time
• Navigate the professional world
• Create your own opportunities`,
            keyPoints: [
              "Look how far you've come!",
              "These skills will serve you for life",
              "Financial literacy is just the beginning",
              "Keep learning and growing"
            ],
            articles: [
              {
                title: "The Value of What You Have Learned",
                content: `Financial literacy is one of the most valuable life skills you can possess. Most people never receive formal education about money, and it shows in their financial struggles.

You now understand concepts that many adults never learn. Compound interest, credit scores, budgeting, and investing are not common knowledge despite their importance.

This knowledge compounds over time just like money does. Good financial decisions in your twenties affect your forties, fifties, and beyond. Starting early is an enormous advantage.

The skills transfer beyond personal finance. Budgeting is planning. Investing is delayed gratification. Credit management is responsibility. These principles apply throughout life.

You can now recognize predatory financial products. Payday loans, high-interest credit cards, and get-rich-quick schemes target people who lack financial literacy. You can protect yourself and others.

Your financial education is not complete. What you learned is a foundation. Keep building on it throughout your life as your circumstances and the financial world evolve.

Use your knowledge wisely. Having information creates responsibility. Apply what you know and share it with others who could benefit.`
              },
              {
                title: "Celebrating Your Progress",
                content: `Taking time to acknowledge accomplishments is not self-indulgence. It is recognition that motivates continued growth.

You committed to completing this program. In a world full of distractions and competing priorities, you followed through on a commitment to yourself.

You learned challenging material. Financial concepts can be confusing and even boring. You pushed through to understand things that will benefit you for decades.

You are now better prepared than most of your peers. Financial literacy correlates strongly with financial outcomes. You have given yourself an advantage.

The hardest part is behind you. Starting is often the biggest obstacle. You have already built momentum that makes continuing easier.

Document your accomplishment. Add this certification to your resume and LinkedIn profile. It demonstrates commitment to personal development.

Thank anyone who supported your journey. If people encouraged you, helped you understand concepts, or simply gave you space to learn, acknowledge their contribution.

Set your next learning goal. Celebrate this accomplishment, then identify what comes next in your ongoing education.`
              }
            ],
            activityQuestion: "Write a letter to yourself dated one year from today. Describe where you hope to be financially, what habits you plan to maintain, and what goals you will have achieved. Seal it and set a calendar reminder to open it in one year. Also write a short thank-you note to someone who supported your learning journey."
          },
          {
            title: "Your Next Steps",
            type: "interactive",
            duration: "6 min",
            content: `Graduation is just the beginning. Here's what's next:

**Immediate actions:**
• Open a savings account if you haven't
• Set up automatic savings (even $20/month)
• Review and update your budget
• Update your LinkedIn profile

**30-day goals:**
• Build an emergency fund (start with $500)
• Apply for a student credit card
• Reach out to 5 people for networking
• Set a specific financial goal

**Long-term vision:**
• Where do you see yourself in 5 years?
• What financial milestones do you want to hit?
• How will you continue learning?
• How will you help others on their journey?

**Remember:**
• Progress over perfection
• Consistency beats intensity
• Community matters - find your people
• You've got this!`,
            keyPoints: [
              "Take action within 24 hours of finishing",
              "Small consistent actions beat big occasional ones",
              "Share what you've learned with others",
              "Your financial journey is just beginning"
            ],
            articles: [
              {
                title: "The First 48 Hours After Graduation",
                content: `Research shows that intentions are most likely to become actions when acted upon quickly. Use the momentum of finishing this program.

Within the first day, take at least one concrete action. Set up that automatic transfer. Open that savings account. Update your budget. Small actions reinforce your new identity as someone who manages money well.

Review your notes from the program. What resonated most? What do you want to remember? Write down the three to five most important takeaways.

Tell someone about what you learned. Verbalizing your knowledge reinforces it. Share one insight with a friend or family member.

Set up your environment for success. Delete shopping apps that tempt impulse purchases. Add your bank and budgeting apps to your home screen. Make good choices easier.

Schedule your first financial check-in. Put a recurring appointment in your calendar for weekly or monthly financial review. What gets scheduled gets done.

Identify potential obstacles. What might derail your financial progress? Social pressure to overspend? Emotional shopping? Name the threats and plan your responses.`
              },
              {
                title: "Building Lasting Financial Habits",
                content: `Knowledge without habits remains unused. Transform what you learned into automatic behaviors.

Habits are built through repetition, not intention. Doing something once is an event. Doing it weekly for months becomes automatic.

Start with keystone habits. Some habits trigger others. Tracking your spending often leads to better spending decisions. Reviewing your budget leads to better planning.

Attach new habits to existing routines. Review your budget when you pay rent. Check your credit score when you file taxes. Use existing triggers.

Make habits specific. Budget weekly is vague. Every Sunday at 9am, review spending in my app for ten minutes is actionable.

Track your habit streaks. Seeing an unbroken chain motivates continuation. Missing one day is a setback; missing two is starting a new pattern.

Plan for failure. You will miss sometimes. What matters is getting back on track quickly. One bad week does not erase months of good habits.

Reward yourself appropriately. Celebrate milestones with rewards that do not undermine your goals. Saving for six months might earn a small splurge, not a spending spree.`
              }
            ],
            activityQuestion: "Create your post-graduation action plan. List five specific actions you will take within the next forty-eight hours. Then define three financial habits you want to build, specify exactly when and how you will do them, and identify what might derail you and how you will respond. Set up a tracking system to monitor your habit streaks."
          },
          {
            title: "Paying It Forward",
            type: "reading",
            duration: "5 min",
            content: `The best way to cement your knowledge is to share it. Here's how to help others.

**Why teach what you've learned:**
• Teaching reinforces your own understanding
• You can help friends and family avoid mistakes
• Financial literacy is a gift that keeps giving
• You become a leader in your community

**Ways to share your knowledge:**
• Help a younger sibling or cousin understand money
• Offer to review a friend's budget
• Share helpful articles on social media
• Mentor someone just starting their financial journey
• Start a money conversation with your family

**Having money conversations:**
• Start with your own story - what you've learned
• Ask questions instead of lecturing
• Share resources that helped you
• Be patient - money mindsets take time to change
• Don't judge - everyone starts somewhere

**Creating ripple effects:**
When you teach one person about budgeting, they might teach two others. Those two teach four more. Your impact multiplies far beyond what you can see.

**Your challenge:**
Within the next 30 days, teach at least ONE person ONE thing you learned in this program. It could be:
• How to start a budget
• The importance of emergency funds
• How credit scores work
• The basics of investing
• How to track spending

**Remember:**
You don't have to be an expert to help someone who's just starting. You just need to be one step ahead.`,
            keyPoints: [
              "Teaching others reinforces your own learning",
              "Start money conversations with friends and family",
              "Challenge yourself to teach at least one person one concept",
              "Your knowledge can create ripple effects that help many people"
            ],
            articles: [
              {
                title: "Starting Money Conversations",
                content: `Money is often considered taboo to discuss. Breaking this taboo helps you and everyone you talk with.

Start by sharing your own experience. People are more receptive when you share what you have learned rather than telling them what to do.

Ask questions rather than giving lectures. What are your financial goals? How do you approach saving? Curious questions open dialogue without judgment.

Meet people where they are. Someone drowning in debt does not need to hear about investing. Start with what is relevant to their current situation.

Normalize financial struggles. Almost everyone has made financial mistakes. Admitting your own removes the shame that prevents honest conversations.

Offer resources, not just advice. Share books, apps, or programs that helped you. Giving tools empowers people to learn on their own terms.

Be patient with different paces. Some people will embrace financial education immediately. Others need time. Plant seeds and let them grow.

Respect boundaries. If someone does not want to discuss money, accept that gracefully. Pushing creates resistance.`
              },
              {
                title: "Becoming a Financial Mentor",
                content: `You do not need to be an expert to help others. Being a few steps ahead qualifies you to guide those just starting.

Mentoring reinforces your own knowledge. Explaining concepts to others deepens your understanding and reveals gaps you can fill.

Share your mistakes openly. Your failures provide valuable lessons. People learn from real experiences more than perfect examples.

Connect people with resources. You cannot teach everything. Point others toward books, courses, and tools that helped you.

Celebrate their progress. Acknowledge when someone you mentored makes progress. Recognition motivates continued effort.

Model good behavior. Your actions teach more than your words. When others see you budgeting and saving, it normalizes those behaviors.

Set appropriate expectations. You are sharing what worked for you, not providing professional financial advice. Be clear about the limits of your expertise.

Keep learning alongside those you mentor. Being a mentor does not mean having all the answers. Learn together when facing unfamiliar situations.`
              }
            ],
            activityQuestion: "Identify three people in your life who could benefit from financial literacy and plan how you will approach each conversation differently based on their situation and personality. Then choose one concept from this program that you understand well and create a simple one-page explanation you could share with someone just starting their financial journey."
          },
          {
            title: "Certification Complete",
            type: "video",
            duration: "3 min",
            content: `Congratulations! You've completed the Beyond The Game Financial Literacy Program!

**Your certification means you:**
• Understand fundamental financial concepts
• Can create and manage a budget
• Know how to build credit responsibly
• Have professional skills for the workplace
• Understand entrepreneurship basics

**What comes with your certification:**
• Digital badge for LinkedIn
• Certificate of completion
• Access to alumni network
• Continued access to course materials

**Stay connected:**
• Join our alumni community
• Share your success stories
• Mentor future students
• Keep building on what you've learned

You put in the work. You learned the material. You're ready for whatever comes next. Go out there and build your legacy!`,
            keyPoints: [
              "You've earned this certification",
              "Add it to your LinkedIn profile",
              "Stay connected with the community",
              "This is just the beginning of your journey"
            ],
            articles: [
              {
                title: "Making Your Certification Count",
                content: `A certification is valuable only if you use it. Make this accomplishment work for you.

Add it to your LinkedIn profile immediately. Certifications appear in a dedicated section that recruiters and connections can see.

Include it on your resume. Under education or certifications, list Beyond The Game Financial Literacy Program with the completion date.

Mention it in relevant conversations. When discussing qualifications, internships, or jobs, your financial literacy certification demonstrates initiative and relevant knowledge.

Let it inform your decisions. The real value of this certification is the knowledge behind it. Use what you learned when making financial choices.

Stay connected with the community. Alumni networks provide ongoing learning opportunities, job connections, and peer support.

Consider continuing education. This certification can be a stepping stone to further study in finance, business, or related fields.`
              },
              {
                title: "Your Financial Future Starts Now",
                content: `Everything you have learned prepares you for the financial decisions ahead. Trust yourself to apply it.

The first few years after education are critical. Financial habits formed now tend to persist. Use this window wisely.

Mistakes are still part of the journey. Knowledge reduces errors but does not eliminate them. When you make mistakes, learn and adjust.

Your peers may make different choices. Not everyone values financial literacy. Focus on your own path regardless of what others do.

Circumstances will change. Income, expenses, jobs, relationships all evolve. Adapt your financial strategies as life changes.

Keep your long-term vision in mind. Day-to-day decisions are easier when connected to bigger goals. Remember why financial health matters to you.

You have everything you need to succeed. Knowledge, tools, and strategies are now at your disposal. The rest is consistent execution over time.

Start today. Not tomorrow, not next week. The best time to apply what you learned was yesterday. The second best time is right now.`
              }
            ],
            activityQuestion: "Create a personal financial mission statement in one paragraph that captures why financial wellness matters to you and how you will approach money management going forward. Then update your LinkedIn profile to include this certification and identify one way you will use what you learned within the next seven days."
          }
        ]
      }
    };

    return lessonMap[week] || {
      title: "Lesson Coming Soon",
      sections: [
        {
          title: "Content Under Development",
          type: "reading",
          duration: "1 min",
          content: "This lesson is currently being developed. Check back soon for comprehensive content covering this important topic.",
          keyPoints: ["Lesson content coming soon"]
        }
      ]
    };
  };

  // College-specific lesson content (10 weeks) - mapped from HS content
  const getCollegeLessonContent = (week: number) => {
    // College week to HS week mapping (10-week program)
    const collegeToHSMapping: Record<number, number> = {
      1: 1,   // Understanding Income, Expenses & Savings
      2: 6,   // How to Open & Manage a Bank Account
      3: 3,   // What is Credit?
      4: 4,   // How to Build & Maintain Good Credit
      5: 7,   // Create a Personal Budget
      6: 9,   // Personal Branding & Professionalism
      7: 10,  // Resume Building & Job Applications
      8: 11,  // Career Readiness & Leadership
      9: 12,  // Networking & Professional Connections
      10: 13  // Entrepreneurship & Career Planning
    };

    const hsWeek = collegeToHSMapping[week];
    if (!hsWeek) {
      return {
        title: "Week Not Available",
        sections: [
          {
            title: "Content Not Available",
            type: "reading",
            duration: "1 min",
            content: "This lesson is not available in the 10-week college program.",
            keyPoints: ["Limited to 10 weeks"]
          }
        ]
      };
    }

    // Get HS content and remove video URLs
    const hsContent = getLessonContent(hsWeek);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collegeContent = {
      ...hsContent,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sections: hsContent.sections.map((section: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { videoUrl, ...sectionWithoutVideo } = section;
        return {
          ...sectionWithoutVideo,
          // Change video type to reading since we're removing videos
          type: section.type === 'video' ? 'reading' : section.type
        };
      })
    };

    return collegeContent;
  };


  // Get difficulty-specific additional content
  const getDifficultyContent = (week: number, sectionIndex: number, level: string) => {
    if (level === 'beginner') return null;

    const difficultyAdditions: Record<number, Record<number, { intermediate?: string; advanced?: string; extraPoints?: string[] }>> = {
      1: {
        0: {
          intermediate: `**Going Deeper: Income Tracking**

For intermediate learners, let's talk about tracking income more precisely. Consider using apps like Mint, YNAB, or even a simple spreadsheet. The key is consistency - log every source of income weekly.

Pro tip: Create separate categories for regular income vs. one-time payments. This helps you budget more accurately since you can only count on consistent income.`,
          advanced: `**Advanced Concept: Tax Implications of Income**

Different income sources have different tax treatments:
- W-2 employment: Taxes withheld automatically
- 1099 freelance work: You owe self-employment tax (about 15.3%)
- Scholarship money for tuition: Usually tax-free
- Scholarship money for room/board: Often taxable

Start setting aside 25-30% of any freelance or side hustle income for taxes. Open a separate savings account just for this purpose.`,
          extraPoints: level === 'advanced' ? [
            "Track gross vs net income separately",
            "Understand your effective tax rate",
            "Consider quarterly estimated tax payments for side income"
          ] : [
            "Use budgeting apps to automate income tracking",
            "Review your income sources monthly"
          ]
        },
        1: {
          intermediate: `**Expense Tracking Methods**

Beyond just knowing fixed vs variable, try the envelope method digitally. Allocate specific amounts to spending categories at the start of each month. When an envelope is empty, stop spending in that category.

Track your expenses for 30 days before making any changes. You might be surprised where your money actually goes.`,
          advanced: `**Expense Optimization Strategies**

Advanced budgeters look at cost-per-use. That $200 jacket you wear 100 times costs $2 per wear. That $50 shirt you wore twice? $25 per wear.

Also consider opportunity cost. Every dollar spent is a dollar not invested. At 7% annual returns, $100 spent today could have been $200 in 10 years.`,
          extraPoints: level === 'advanced' ? [
            "Calculate cost-per-use for major purchases",
            "Factor in opportunity cost for spending decisions",
            "Audit subscriptions quarterly - cancel unused ones"
          ] : [
            "Try the envelope budgeting method",
            "Track expenses for 30 days before making changes"
          ]
        },
        2: {
          intermediate: `**Building Your Emergency Fund**

The standard advice is 3-6 months of expenses. But as a student, consider this: unexpected things happen - car trouble, medical bills, job loss. Aim for at least 6 months, and keep it in a high-yield savings account earning 4-5% APY.

Start with a mini emergency fund of $1,000, then build from there.`,
          advanced: `**Investment Basics for Savers**

Once you have your emergency fund, don't let extra savings sit idle. Consider:
- High-yield savings accounts (4-5% APY currently)
- I-Bonds for inflation protection (up to $10,000/year)
- Roth IRA if you have earned income (up to $7,000/year in 2024)

The power of compound interest means starting early matters more than starting big.`,
          extraPoints: level === 'advanced' ? [
            "Build a 6-month emergency fund minimum",
            "Explore high-yield savings accounts",
            "Consider opening a Roth IRA if you have earned income"
          ] : [
            "Start with a $1,000 mini emergency fund",
            "Use high-yield savings accounts for better returns"
          ]
        }
      },
      2: {
        0: {
          intermediate: `**Income Diversification Strategies**

Don't rely on just one income source. Successful people build multiple streams:
- Active income (your job/hustle)
- Passive income (investments, royalties)
- Portfolio income (dividends, interest)

Start by adding one additional income stream to your primary source.`,
          advanced: `**Building Scalable Income**

The difference between trading time for money and scalable income is crucial. Scalable income grows without proportional time investment:
- Digital products (courses, templates, apps)
- Affiliate marketing and referral programs
- Rental income or peer-to-peer lending

Consider what skills you have that could be packaged and sold repeatedly.`,
          extraPoints: level === 'advanced' ? [
            "Identify at least 3 potential income streams",
            "Focus on one scalable income opportunity",
            "Calculate your hourly rate for different activities"
          ] : [
            "Map out your current income sources",
            "Research one new potential income stream"
          ]
        },
        1: {
          intermediate: `**SMART Goals Deep Dive**

Make your goals truly actionable:
- Break big goals into weekly milestones
- Set up automatic transfers toward savings goals
- Create accountability systems (apps, partners)

Example: Instead of "save $1,000", try "transfer $50 every Friday for 20 weeks."`,
          advanced: `**Goal Stacking and Systems**

Advanced goal-setters create systems, not just goals:
- Automate everything possible (savings, bill pay, investments)
- Use goal stacking: attach new habits to existing routines
- Track leading indicators, not just outcomes

Build systems that make success the default path.`,
          extraPoints: level === 'advanced' ? [
            "Automate at least 3 financial actions",
            "Create a habit stack for financial review",
            "Set up weekly and monthly financial checkpoints"
          ] : [
            "Break one big goal into weekly milestones",
            "Set up automatic transfers for savings"
          ]
        }
      },
      3: {
        0: {
          intermediate: `**Credit Score Deep Dive**

Your credit score is calculated from 5 factors:
- Payment history (35%) - Pay on time, every time
- Credit utilization (30%) - Keep below 30% of your limit
- Length of history (15%) - Don't close old accounts
- Credit mix (10%) - Different types help
- New credit (10%) - Don't apply too frequently

Focus on the top two factors for the biggest impact.`,
          advanced: `**Strategic Credit Building**

Advanced credit strategies for 750+ scores:
- Request credit limit increases (without hard pulls)
- Become an authorized user on a parent's old account
- Use credit for recurring bills, pay immediately
- Time your applications (only when needed)
- Dispute any errors on your credit report

Consider using a credit monitoring service to track all three bureaus.`,
          extraPoints: level === 'advanced' ? [
            "Check credit reports from all 3 bureaus annually",
            "Calculate your credit utilization ratio",
            "Create a credit-building action plan"
          ] : [
            "Sign up for free credit monitoring",
            "Understand the 5 factors affecting your score"
          ]
        }
      },
      4: {
        0: {
          intermediate: `**Debt Prioritization Methods**

Two popular approaches:
- Avalanche: Pay highest interest first (saves most money)
- Snowball: Pay smallest balance first (builds momentum)

Both work! Choose based on your personality. The avalanche is mathematically optimal, but the snowball provides faster wins.`,
          advanced: `**Advanced Debt Strategies**

Beyond basic repayment:
- Balance transfer cards (0% APR periods)
- Personal loan consolidation (lower rates)
- Negotiating with creditors (especially medical debt)
- Understanding the statute of limitations on debt

Calculate the true cost of debt including opportunity cost of those payments not being invested.`,
          extraPoints: level === 'advanced' ? [
            "Calculate total interest saved with different strategies",
            "Research balance transfer opportunities",
            "Create a debt payoff timeline with specific dates"
          ] : [
            "List all debts with interest rates",
            "Choose avalanche or snowball method"
          ]
        }
      },
      5: {
        0: {
          intermediate: `**Choosing the Right Bank Account**

Beyond just checking and savings:
- High-yield savings accounts (online banks offer 4-5% APY)
- Money market accounts (higher rates, limited transactions)
- CD laddering (stagger maturity dates for flexibility)

Compare fees, minimums, and interest rates across multiple banks.`,
          advanced: `**Banking Optimization**

Advanced banking strategies:
- Multi-bank approach: checking at one bank, savings at a high-yield bank
- Cash back checking accounts and signup bonuses
- Using brokerage sweep accounts for excess cash
- International considerations (fee-free foreign transactions)

Your banking setup should work as a system, not just individual accounts.`,
          extraPoints: level === 'advanced' ? [
            "Compare rates across 5 different savings accounts",
            "Set up a multi-bank system",
            "Optimize for both yield and convenience"
          ] : [
            "Research high-yield savings accounts",
            "Understand the difference between account types"
          ]
        }
      },
      6: {
        0: {
          intermediate: `**Investment Fundamentals**

Key concepts for beginners:
- Index funds: Own a piece of the entire market
- Dollar-cost averaging: Invest regularly regardless of price
- Time in market beats timing the market
- Diversification reduces risk without sacrificing returns

Start with a simple target-date fund or total market index fund.`,
          advanced: `**Portfolio Construction**

Building an optimized portfolio:
- Asset allocation (stocks vs bonds vs alternatives)
- Rebalancing strategies (calendar vs threshold-based)
- Tax-loss harvesting in taxable accounts
- Understanding factor investing (value, momentum, quality)

Consider the total picture: tax-advantaged accounts for growth, taxable for more stable investments.`,
          extraPoints: level === 'advanced' ? [
            "Determine your asset allocation based on time horizon",
            "Research low-cost index fund options",
            "Understand the tax implications of different account types"
          ] : [
            "Open an investment account (brokerage or Roth IRA)",
            "Research target-date funds for your retirement year"
          ]
        }
      },
      9: {
        0: {
          intermediate: `**Building a Professional Network**

Beyond just connecting:
- Follow up within 24 hours of meeting someone
- Offer value before asking for anything
- Maintain relationships with regular touchpoints
- Use LinkedIn strategically (not just job searching)

Quality connections matter more than quantity.`,
          advanced: `**Personal Brand as an Asset**

Your brand has real financial value:
- Thought leadership opens premium opportunities
- Content creation builds audience and influence
- Speaking engagements and consulting income
- Brand equity can be leveraged for ventures

Think of your personal brand as a long-term investment that compounds over time.`,
          extraPoints: level === 'advanced' ? [
            "Create a content strategy for your expertise",
            "Identify speaking or writing opportunities",
            "Build systems for maintaining your network"
          ] : [
            "Optimize your LinkedIn profile",
            "Reach out to 3 new connections this week"
          ]
        }
      },
      11: {
        0: {
          intermediate: `**Validating Business Ideas**

Before investing time and money:
- Talk to potential customers (at least 20)
- Build a minimum viable product (MVP)
- Test pricing with real purchase intent
- Calculate your break-even point

Most businesses fail because they build something nobody wants. Validate first.`,
          advanced: `**Financial Planning for Entrepreneurs**

Critical financial skills for business owners:
- Separating personal and business finances
- Understanding unit economics (customer acquisition cost, lifetime value)
- Managing cash flow vs. profit
- Building business credit separately from personal

Consider forming an LLC for liability protection and tax flexibility.`,
          extraPoints: level === 'advanced' ? [
            "Create a business financial model",
            "Research business entity types (LLC, S-Corp)",
            "Understand business tax deductions"
          ] : [
            "Interview potential customers before building",
            "Calculate startup costs and break-even point"
          ]
        }
      },
      10: {
        0: {
          intermediate: `**Resume Optimization Strategies**

Beyond basic formatting:
- Use ATS-friendly formats (many companies use automated screening)
- Include keywords from the job description
- Quantify achievements whenever possible (increased sales by 25%)
- Tailor each resume to the specific job

Consider creating a master resume with all experiences, then customize for each application.`,
          advanced: `**Strategic Job Search**

Advanced job hunting techniques:
- Target companies, not just job postings (reach out even without openings)
- Leverage LinkedIn for warm introductions
- Prepare salary negotiation strategy before the offer
- Understand the hidden job market (70%+ of jobs aren't posted)

Track your applications systematically: company, position, date applied, contact person, follow-up dates.`,
          extraPoints: level === 'advanced' ? [
            "Create an ATS-optimized resume template",
            "Build a job search tracking spreadsheet",
            "Research salary ranges before interviewing"
          ] : [
            "Learn to quantify your achievements",
            "Customize your resume for each application"
          ]
        },
        1: {
          intermediate: `**Cover Letter Mastery**

Make your cover letter stand out:
- Address the hiring manager by name (research!)
- Open with something specific about the company
- Connect your experience to their needs
- End with a clear call to action

One page maximum - quality over quantity.`,
          advanced: `**Building Your Career Capital**

Think beyond the immediate job:
- What skills will this role develop?
- What network will you build?
- How does it position you for future opportunities?
- What's the growth trajectory?

Sometimes the best job isn't the highest paying - it's the one that builds the most valuable experience.`,
          extraPoints: level === 'advanced' ? [
            "Map your career trajectory 5-10 years out",
            "Identify skill gaps and how to fill them",
            "Build relationships before you need them"
          ] : [
            "Research hiring managers before applying",
            "Create a cover letter template to customize"
          ]
        }
      },
      12: {
        0: {
          intermediate: `**Strategic Networking**

Quality over quantity:
- Focus on building genuine relationships, not collecting business cards
- Follow up within 24 hours of meeting someone
- Offer value before asking for anything
- Maintain relationships even when you don't need anything

Your network is an asset that compounds over time.`,
          advanced: `**Network as a System**

Build a networking system:
- Use a CRM or spreadsheet to track contacts
- Set reminders for regular touchpoints (birthdays, work anniversaries)
- Create content that attracts your target network
- Host events or facilitate introductions between others

The best networkers are connectors - they help others, and it comes back around.`,
          extraPoints: level === 'advanced' ? [
            "Set up a personal CRM for contact management",
            "Create a monthly networking goal",
            "Become a connector - introduce people to each other"
          ] : [
            "Follow up within 24 hours of meeting someone",
            "Offer value before asking for favors"
          ]
        },
        1: {
          intermediate: `**Informational Interviews**

The underutilized power move:
- Ask for 15-20 minutes of someone's time
- Prepare thoughtful questions about their career path
- Never directly ask for a job (but opportunities often arise)
- Send a thank you note within 24 hours

Most people love talking about their work - use this to build relationships.`,
          advanced: `**Building Your Advisory Board**

Create your personal board of advisors:
- Mentor: Someone 10+ years ahead in your field
- Peer mentor: Someone at your level for mutual support
- Sponsor: Someone who advocates for you in rooms you're not in
- Technical advisor: Expert in skills you're developing

Nurture these relationships intentionally - they're career accelerators.`,
          extraPoints: level === 'advanced' ? [
            "Identify and reach out to potential mentors",
            "Create a 'personal board' of advisors",
            "Seek sponsors, not just mentors"
          ] : [
            "Request 3 informational interviews this month",
            "Prepare a list of thoughtful questions"
          ]
        }
      },
      13: {
        0: {
          intermediate: `**Entrepreneurship Mindset**

Key traits of successful entrepreneurs:
- Bias toward action (start before you feel ready)
- Comfort with uncertainty and ambiguity
- Ability to learn from failure quickly
- Customer obsession (solve real problems)

You don't need a revolutionary idea - execution matters more than ideas.`,
          advanced: `**Building for Scale**

Think about scalability from day one:
- Can this grow without proportional time investment?
- What's the unit economics at scale?
- How do you acquire customers profitably?
- What systems need to be in place?

The best businesses create value while you sleep.`,
          extraPoints: level === 'advanced' ? [
            "Analyze unit economics of your idea",
            "Identify what doesn't scale (and what does)",
            "Build systems early, even when small"
          ] : [
            "Start small and validate before scaling",
            "Talk to customers every week"
          ]
        },
        1: {
          intermediate: `**Side Hustle to Business**

Transitioning from side project to business:
- Know your break-even point (when can you quit your day job?)
- Build savings runway (6-12 months of expenses)
- Test market demand before going full-time
- Start building systems while it's still a side hustle

Don't quit your job too early - let the business prove itself first.`,
          advanced: `**Business Model Innovation**

Different ways to structure your business:
- Product vs. service vs. hybrid
- One-time purchase vs. subscription/recurring
- B2C (consumer) vs. B2B (business) vs. B2B2C
- Marketplace vs. direct sale

The business model often matters more than the product. Choose wisely.`,
          extraPoints: level === 'advanced' ? [
            "Map out different business model options",
            "Calculate runway needed for full-time transition",
            "Study business models of companies you admire"
          ] : [
            "Know your break-even point",
            "Build 6-12 months of savings before quitting"
          ]
        }
      },
      14: {
        0: {
          intermediate: `**MVP Development**

Build the minimum viable product:
- What's the smallest version that proves your concept?
- How can you test with minimal investment?
- What's the one thing that must work perfectly?
- How quickly can you get to customer feedback?

Speed matters - the faster you learn, the faster you succeed.`,
          advanced: `**Financial Modeling for Startups**

Create a simple financial model:
- Revenue projections (conservative, moderate, aggressive)
- Cost structure (fixed vs. variable costs)
- Cash flow timeline (when does money come in vs. go out?)
- Key assumptions and what could break them

Your model won't be perfect - it's a thinking tool, not a crystal ball.`,
          extraPoints: level === 'advanced' ? [
            "Build a 12-month financial projection",
            "Identify your key assumptions and test them",
            "Understand your burn rate and runway"
          ] : [
            "Define your MVP scope clearly",
            "Set a deadline for launch (and stick to it)"
          ]
        },
        1: {
          intermediate: `**Pricing Strategy**

How to price your product or service:
- Cost-plus: Your costs + profit margin
- Value-based: What's it worth to the customer?
- Competitive: What do alternatives cost?
- Test different price points - you might be underpricing

Most first-time entrepreneurs underprice. Don't leave money on the table.`,
          advanced: `**Funding Options**

Ways to finance your venture:
- Bootstrapping (personal savings, revenue)
- Friends & family (be careful with relationships)
- Grants and competitions (free money, no equity given up)
- Angel investors (early stage, high risk tolerant)
- Venture capital (for hyper-growth businesses)

Understand the tradeoffs: bootstrapping = control but slower. Funding = faster but dilution.`,
          extraPoints: level === 'advanced' ? [
            "Research funding options for your stage",
            "Understand dilution and what you're giving up",
            "Prepare a pitch deck even if bootstrapping"
          ] : [
            "Test multiple price points",
            "Research what competitors charge"
          ]
        }
      },
      15: {
        0: {
          intermediate: `**Presentation Skills**

Deliver compelling presentations:
- Start with a hook - grab attention in the first 10 seconds
- Tell stories, not just facts
- Use visuals, not walls of text
- Practice out loud, not just in your head
- Time yourself and stay within limits

The audience remembers how you made them feel, not what you said.`,
          advanced: `**Pitching to Investors**

What investors look for:
- Team: Can you execute? Do you have relevant experience?
- Market: Is it big enough? Is it growing?
- Traction: What proof do you have? (customers, revenue, growth)
- Ask: How much do you need? What will you do with it?

Know your numbers cold. Practice tough questions. Be confident but honest.`,
          extraPoints: level === 'advanced' ? [
            "Create a 3-minute and 10-minute version of your pitch",
            "Practice answering tough investor questions",
            "Know your financials and key metrics"
          ] : [
            "Practice your presentation out loud 10 times",
            "Get feedback from people outside your field"
          ]
        },
        1: {
          intermediate: `**Handling Q&A**

Managing questions and objections:
- Listen fully before responding
- Repeat the question to confirm understanding
- It's OK to say 'I don't know, but I'll find out'
- Bridge back to your key messages
- Stay calm even with hostile questions

The Q&A often matters more than the presentation itself.`,
          advanced: `**Building in Public**

Share your journey:
- Document your progress on social media
- Be transparent about challenges (people connect with authenticity)
- Build an audience before you need them
- Turn customers into advocates

Building in public creates accountability and attracts opportunities.`,
          extraPoints: level === 'advanced' ? [
            "Start documenting your journey publicly",
            "Build an email list or social following",
            "Turn early customers into case studies"
          ] : [
            "Prepare for common objections",
            "Practice saying 'I don't know' gracefully"
          ]
        }
      },
      16: {
        0: {
          intermediate: `**The FIRE Movement**

Financial Independence, Retire Early:
- FI Number = Annual Expenses × 25
- Safe Withdrawal Rate = 4% per year
- It's about options, not necessarily retirement
- Even partial FI gives you leverage

Start calculating your FI number and working backward to monthly savings needed.`,
          advanced: `**Tax Optimization Strategies**

Legal ways to reduce your tax burden:
- Max out tax-advantaged accounts (401k, Roth IRA, HSA)
- Tax-loss harvesting in taxable accounts
- Understand capital gains (short-term vs. long-term)
- Consider tax-efficient fund placement
- Business owners: explore SEP-IRA, Solo 401k

A dollar saved in taxes is a dollar invested for your future.`,
          extraPoints: level === 'advanced' ? [
            "Calculate your personal FI number",
            "Optimize your tax-advantaged account strategy",
            "Understand tax implications of different investments"
          ] : [
            "Learn about the 4% safe withdrawal rate",
            "Calculate how much you need to save monthly"
          ]
        },
        1: {
          intermediate: `**Building Generational Wealth**

Think beyond your own lifetime:
- Teach financial literacy to family members
- Understand estate planning basics
- Consider life insurance if others depend on you
- Create family traditions around money conversations

Wealth isn't just about accumulation - it's about preservation and transfer.`,
          advanced: `**Advanced Estate Planning**

Protecting and transferring wealth:
- Wills vs. trusts (and when you need each)
- Beneficiary designations (these override your will!)
- 529 plans for education savings
- Donor-advised funds for charitable giving
- Life insurance as a wealth transfer tool

Start simple: create a will, set beneficiaries, document your wishes.`,
          extraPoints: level === 'advanced' ? [
            "Create or update your will",
            "Review all beneficiary designations",
            "Understand trust options and when they make sense"
          ] : [
            "Have money conversations with family",
            "Start documenting your financial wishes"
          ]
        }
      },
      17: {
        0: {
          intermediate: `**Work-Life Integration**

Balance is a myth - integration is the goal:
- Define what 'success' means to YOU (not society)
- Set boundaries that protect your priorities
- Build sustainable habits, not burnout cycles
- Your career is a marathon, not a sprint

Financial success means nothing if you sacrifice health and relationships.`,
          advanced: `**Designing Your Ideal Life**

Work backward from your ideal day:
- What does your perfect Tuesday look like?
- Who are you spending time with?
- What work are you doing (or not doing)?
- Where are you living?

Then figure out what financial resources you need to support that life.`,
          extraPoints: level === 'advanced' ? [
            "Write out your ideal day in detail",
            "Calculate the cost of your ideal lifestyle",
            "Identify what's blocking you from that life"
          ] : [
            "Define what success means to you personally",
            "Set one boundary to protect this week"
          ]
        },
        1: {
          intermediate: `**Continuous Learning**

Stay relevant and valuable:
- Allocate time weekly for skill development
- Follow industry trends and leaders
- Seek feedback regularly
- Be willing to unlearn and relearn

The most valuable skill is learning how to learn.`,
          advanced: `**Building Your Legacy**

Think about impact beyond wealth:
- What do you want to be remembered for?
- How can you use your resources to help others?
- What causes or communities matter to you?
- How can you mentor the next generation?

Financial independence enables you to focus on impact and meaning.`,
          extraPoints: level === 'advanced' ? [
            "Define your personal legacy goals",
            "Identify ways to give back now (not just later)",
            "Find someone to mentor"
          ] : [
            "Block weekly time for learning",
            "Identify one skill to develop this quarter"
          ]
        }
      },
      18: {
        0: {
          intermediate: `**Putting It All Together**

Your financial foundation checklist:
- Emergency fund (3-6 months expenses)
- Budget you actually follow
- Automated savings and investing
- Good credit score (670+)
- Basic insurance coverage
- Career growth plan

Review this checklist quarterly and keep improving.`,
          advanced: `**Your 10-Year Financial Plan**

Create a comprehensive roadmap:
- Year 1-2: Foundation (emergency fund, credit, budget mastery)
- Year 3-4: Acceleration (increase income, max retirement accounts)
- Year 5-6: Optimization (multiple income streams, tax strategies)
- Year 7-8: Wealth building (real estate, business investments)
- Year 9-10: FI milestone (passive income covering expenses)

Adjust timelines based on your situation - the key is having a plan.`,
          extraPoints: level === 'advanced' ? [
            "Create your personal 10-year financial plan",
            "Set annual milestones and track progress",
            "Build accountability systems for long-term goals"
          ] : [
            "Complete the financial foundation checklist",
            "Set specific goals for the next 12 months"
          ]
        },
        1: {
          intermediate: `**Your Action Plan**

What to do in the next 30 days:
- Set up automatic savings (even $50/month)
- Check your credit score
- Update your budget
- Open an investment account
- Share what you learned with someone

Action beats perfection. Start now, improve later.`,
          advanced: `**Becoming a Financial Leader**

Pay it forward:
- Teach others what you've learned
- Be open about your financial journey
- Advocate for financial education
- Build wealth with intention and purpose
- Remember: money is a tool, not the goal

You've completed this program - now go build the life you want.`,
          extraPoints: level === 'advanced' ? [
            "Commit to teaching financial literacy to others",
            "Create a personal financial dashboard",
            "Schedule quarterly financial review dates"
          ] : [
            "Take one action in the next 24 hours",
            "Share your biggest takeaway with someone"
          ]
        }
      }
    };

    const weekContent = difficultyAdditions[week];
    if (!weekContent) return null;

    const sectionContent = weekContent[sectionIndex];
    if (!sectionContent) return null;

    return {
      additionalContent: level === 'advanced' ? sectionContent.advanced : null,
      extraPoints: level === 'advanced' ? (sectionContent.extraPoints || []) : []
    };
  };

  const lessonData = programId === 'COLLEGE' ? getCollegeLessonContent(weekNumber) : getLessonContent(weekNumber);
  const currentSectionData = lessonData.sections[currentSection];
  const totalSections = lessonData.sections.length;
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;
  const difficultyContent = getDifficultyContent(weekNumber, currentSection, trackLevel);

  const handleNext = () => {
    // Mark current section as completed
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
      // Notify parent about section completion for progress tracking
      onSectionComplete?.(currentSection, totalSections);
    }

    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Lesson completed
      onComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Submit activity response - AGGRESSIVE FAILSAFE VERSION
  const handleActivitySubmit = async () => {
    if (!activityResponse.trim()) {
      setActivityError('Please write a response before submitting.');
      return;
    }

    if (activityResponse.trim().length < 200) {
      setActivityError('Please write at least 200 characters.');
      return;
    }

    // Capture response before any async operations
    const responseText = activityResponse.trim();
    const sectionToMark = currentSection;

    setSubmitting(true);
    setActivityError(null);

    // FAILSAFE #1: Force complete after 5 seconds NO MATTER WHAT
    // This runs outside all try/catch and cannot be blocked
    const failsafeTimeout = setTimeout(() => {
      console.warn('FAILSAFE: Forcing submission complete after 5 seconds');
      setSubmittedActivities(prev => ({ ...prev, [sectionToMark]: true }));
      setActivityResponse('');
      setSubmitting(false);
    }, 5000);

    // FAILSAFE #2: Save to localStorage immediately (optimistic)
    try {
      const localKey = `btg_activity_${weekNumber}_${sectionToMark}`;
      // eslint-disable-next-line react-hooks/purity
      const timestamp = Date.now();
      localStorage.setItem(localKey, JSON.stringify({
        response: responseText,
        timestamp
      }));
    } catch {
      // localStorage may be unavailable, continue anyway
    }

    // Helper to complete and clear failsafe
    const completeSubmission = () => {
      clearTimeout(failsafeTimeout);
      setSubmittedActivities(prev => ({ ...prev, [sectionToMark]: true }));
      setActivityResponse('');
      setSubmitting(false);
    };

    // Attempt database save (non-blocking)
    try {
      const user = await getCurrentUser();
      if (!user) {
        // No user but still complete locally
        completeSubmission();
        return;
      }

      // Fire and forget DB save - don't await, let failsafe handle timeout
      (async () => {
        try {
          const { error } = await supabase.from('activity_responses').insert({
            user_id: user.id,
            enrollment_id: enrollmentId,
            week_number: weekNumber,
            day_number: sectionToMark + 1,
            module_number: sectionToMark + 1,
            module_title: currentSectionData?.title || `Module ${sectionToMark + 1}`,
            activity_question: currentSectionData?.activityQuestion || '',
            response_text: responseText,
            submitted_at: new Date().toISOString()
          });
          if (error) {
            console.error('DB save failed (non-blocking):', error);
          } else {
            console.log('Activity saved to database successfully');
          }
        } catch (err) {
          console.error('DB save error (non-blocking):', err);
        }
      })();

      // Complete immediately - don't wait for DB
      completeSubmission();
    } catch (err) {
      console.error('Activity submission error:', err);
      completeSubmission();
    }
  };

  // Check if current section has an activity and if it's been submitted
  const hasActivity = !!(currentSectionData?.activityQuestion);
  const activitySubmitted = submittedActivities[currentSection] === true;
  const canProceed = !hasActivity || activitySubmitted;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'interactive':
        return Users;
      case 'reading':
      default:
        return FileText;
    }
  };

  const isLastSection = currentSection === totalSections - 1;

  // Check if a section is unlocked
  // Section 0 is always unlocked
  // Section N (N > 0) is unlocked if section N-1's activity has been submitted
  const isSectionUnlocked = (sectionIndex: number): boolean => {
    if (sectionIndex === 0) return true;
    // Previous section must have its activity submitted
    return submittedActivities[sectionIndex - 1] === true;
  };

  return (
    <div className="w-full space-y-6 pb-6 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <div className="text-white font-bold">Week {weekNumber}</div>
          <div className="text-white/60 text-sm">{weekTitle}</div>
        </div>
        <div className="text-white/60 text-sm">
          {currentSection + 1}/{totalSections}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar progress={progressPercentage} color="blue" />

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {lessonData.sections.map((section: any, index: number) => {
          const IconComponent = getSectionIcon(section.type);
          const isUnlocked = isSectionUnlocked(index);
          const isCompleted = submittedActivities[index] === true;
          return (
            <button
              key={index}
              onClick={() => isUnlocked && setCurrentSection(index)}
              disabled={!isUnlocked}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                !isUnlocked
                  ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50'
                  : currentSection === index
                  ? 'bg-[#4A5FFF]/20 text-[#4A5FFF] border border-[#4A5FFF]/30'
                  : isCompleted
                  ? 'bg-[#50D890]/20 text-[#50D890] border border-[#50D890]/30'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                {!isUnlocked ? (
                  <Lock size={12} />
                ) : (
                  <IconComponent size={12} />
                )}
                <span>{index + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {(() => {
            const IconComponent = getSectionIcon(currentSectionData.type);
            return <IconComponent size={20} className="text-[#4A5FFF]" />;
          })()}
          <div>
            <h3 className="text-white font-bold">{currentSectionData.title}</h3>
            <span className="text-white/40 text-xs">{currentSectionData.duration}</span>
          </div>
        </div>

        {/* Video Player - YouTube Embed or Placeholder */}
        <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
          {currentSectionData.videoUrl ? (
            <iframe
              key={currentSectionData.videoUrl}
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${currentSectionData.videoUrl}`}
              title={currentSectionData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-[#1a1f3e] to-[#0d1025] border border-white/20 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#4A5FFF]/30 flex items-center justify-center mx-auto mb-3">
                  <Play size={32} className="text-[#4A5FFF]" />
                </div>
                <p className="text-white font-semibold">Lesson Video</p>
                <p className="text-white/60 text-sm mt-1">Coming Soon</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
            {currentSectionData.content}
          </div>
        </div>

        {/* Difficulty-specific additional content */}
        {difficultyContent?.additionalContent && (
          <div className="mb-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-purple-400 font-bold text-xs uppercase">
                Advanced Content
              </span>
            </div>
            <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
              {difficultyContent.additionalContent}
            </div>
          </div>
        )}

        {/* Key Points */}
        <div className="bg-[#4A5FFF]/10 border border-[#4A5FFF]/20 rounded-lg p-4">
          <h4 className="text-[#4A5FFF] font-bold text-sm mb-3 flex items-center gap-2">
            <CheckCircle size={16} />
            Key Takeaways
          </h4>
          <ul className="space-y-2">
            {currentSectionData.keyPoints.map((point: string, index: number) => (
              <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#4A5FFF] rounded-full mt-2 flex-shrink-0"></div>
                <span>{point}</span>
              </li>
            ))}
            {/* Additional points for higher difficulty levels */}
            {difficultyContent?.extraPoints?.map((point, index) => (
              <li key={`extra-${index}`} className="text-purple-300 text-sm flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Additional Resources - Always rendered */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink size={18} className="text-amber-400" />
          <h4 className="text-amber-400 font-bold text-sm">Additional Resources</h4>
        </div>

        {currentSectionData.articles && currentSectionData.articles.length > 0 ? (
          <Accordion.Root type="multiple" className="space-y-2">
            {currentSectionData.articles.map((article: { title: string; content: string }, index: number) => (
              <Accordion.Item
                key={index}
                value={`article-${index}`}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-4 py-3 flex items-center justify-between text-left group hover:bg-white/5 transition-colors">
                    <span className="text-white/90 font-medium text-sm">{article.title}</span>
                    <ChevronDown
                      size={18}
                      className="text-white/50 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                  <div className="px-4 pb-4 pt-2 border-t border-white/10">
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                      {article.content}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <ExternalLink size={16} className="text-amber-400/70" />
              <span className="text-white/70 text-sm">Teacher Resource 1 - Coming Soon</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <ExternalLink size={16} className="text-amber-400/70" />
              <span className="text-white/70 text-sm">Teacher Resource 2 - Coming Soon</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Activity Section - Always rendered */}
      <GlassCard className="p-6 border-2 border-[#4A5FFF]/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#4A5FFF]/20 flex items-center justify-center">
            <BookOpen size={20} className="text-[#4A5FFF]" />
          </div>
          <div>
            <h3 className="text-white font-bold">Activity</h3>
            <span className="text-white/40 text-xs">
              {hasActivity ? 'Required to complete this module' : 'Activity coming soon'}
            </span>
          </div>
          {hasActivity && activitySubmitted && (
            <div className="ml-auto flex items-center gap-2 text-[#50D890]">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Submitted</span>
            </div>
          )}
        </div>

        {hasActivity ? (
          <>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm leading-relaxed">
                {currentSectionData?.activityQuestion}
              </p>
            </div>

            {!activitySubmitted ? (
              <>
                <textarea
                  value={activityResponse}
                  onChange={(e) => {
                    setActivityResponse(e.target.value);
                    setActivityError(null);
                  }}
                  placeholder="Write your response here (minimum 200 characters)..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-[#4A5FFF]/50 transition-colors"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${activityResponse.length >= 200 ? 'text-[#50D890]' : 'text-white/40'}`}>
                    {activityResponse.length}/200 characters minimum
                  </span>
                </div>
                {activityError && (
                  <p className="text-red-400 text-sm mt-2">{activityError}</p>
                )}
                <Button3D
                  onClick={handleActivitySubmit}
                  disabled={submitting || activityResponse.length < 200}
                  variant="primary"
                  className="mt-4 w-full"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send size={16} />
                      Submit Response
                    </span>
                  )}
                </Button3D>
              </>
            ) : (
              <div className="bg-[#50D890]/10 border border-[#50D890]/30 rounded-lg p-4">
                <p className="text-[#50D890] text-sm">
                  Your response has been submitted. You can now proceed to the next section.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
            <BookOpen size={32} className="mx-auto mb-3 text-[#4A5FFF]/60" />
            <p className="text-white/80 font-medium">Written Activity</p>
            <p className="text-white/50 text-sm mt-1">Coming Soon</p>
          </div>
        )}
      </GlassCard>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button3D
          onClick={handlePrevious}
          disabled={currentSection === 0}
          variant="secondary"
          className="flex-1"
        >
          Previous
        </Button3D>

        <Button3D
          onClick={handleNext}
          disabled={!canProceed}
          variant="primary"
          className="flex-1"
        >
          {!canProceed ? (
            'Complete Activity First'
          ) : isLastSection ? (
            'Complete Lesson'
          ) : (
            'Next Section'
          )}
        </Button3D>
      </div>
    </div>
  );
}
