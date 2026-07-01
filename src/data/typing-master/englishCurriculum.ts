// =============================================================================
//  TechHat Typing Master â€” English Curriculum
//  Hierarchy: Course â†’ Module â†’ Lesson â†’ Drill
//
//  This file is the single source of truth for all lesson/drill content.
//  It can be seeded into the Postgres DB via `prisma/seed.ts` later.
// =============================================================================

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type DrillType  = "key" | "pairs" | "word" | "sentence" | "paragraph" | "blind" | "intro" | "tip" | "falling" | "fighter";

export interface StarsThreshold {
  stars: 1 | 2 | 3;
  minAccuracy: number; // 0â€“100
  minWpm:      number;
}

export interface IntroPage {
  title:    string;
  titleBn?: string;
  body:     string;   // plain text; use \n for new lines and "\u2022 " prefix for bullets
  bodyBn?:  string;
  image?:   string;   // path relative to public/ e.g. "/hands/left-home-row-1.png"
  // Keyboard visualisation
  highlightKeys?: string[];  // e.g. ["a","s","d","f","j","k","l",";"]
  leftHandImg?:   string;    // PNG filename without extension e.g. "left-home-row-2"
  rightHandImg?:  string;    // PNG filename without extension e.g. "right-home-row-2"
  /** When true the viewer enters full-screen key-press drill mode (no text box) */
  keyPressMode?:  boolean;
  visualGuide?:   "shift-punctuation";
}

export interface Drill {
  id:         string;
  title:      string;
  type:       DrillType;
  content:    string;          // text the user must type (empty for intro/tip)
  difficulty: Difficulty;
  timeLimit:  number;          // seconds (0 = unlimited)
  targetWpm:  number;
  starsThresholds: StarsThreshold[];
  hint?:      string;          // optional coaching hint
  pages?:     IntroPage[];     // multi-page slides for intro / tip drills
}

export interface Lesson {
  id:          string;
  title:       string;
  description: string;
  difficulty:  Difficulty;
  drills:      Drill[];
}

export interface Module {
  id:          string;
  title:       string;
  subtitle:    string;
  icon:        string;         // emoji icon
  color:       string;         // Tailwind bg class
  lessons:     Lesson[];
}

export interface Course {
  id:      string;
  title:   string;
  locale:  "en" | "bn";
  modules: Module[];
}

// â”€â”€â”€ Star threshold factory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function stars(
  s3wpm: number, s3acc: number,
  s2wpm: number, s2acc: number,
  s1wpm: number, s1acc: number,
): StarsThreshold[] {
  return [
    { stars: 3, minWpm: s3wpm, minAccuracy: s3acc },
    { stars: 2, minWpm: s2wpm, minAccuracy: s2acc },
    { stars: 1, minWpm: s1wpm, minAccuracy: s1acc },
  ];
}

// =============================================================================
//  FAST TOUCH TYPING â€” 12 Lessons
//  Follows the classic typing-tutor sequence:
//   1  The Home Row          â€” a s d f  j k l ;
//   2  Keys E and I          â€” e i
//   3  Keys R and U          â€” r u
//   4  Keys T and O          â€” t o
//   5  Capital Letters & .   â€” Shift + letters, period
//   6  Keys C and ,          â€” c ,
//   7  Keys G H and '        â€” g h '
//   8  Keys V N and ?        â€” v n ?
//   9  Keys W and M          â€” w m
//  10  Keys Q and P          â€” q p
//  11  Keys B and Y          â€” b y
//  12  Keys Z and X          â€” z x
// =============================================================================

const FAST_TOUCH_MODULE: Module = {
  id:       "mod-fast-touch",
  title:    "Fast Touch Typing Course",
  subtitle: "Master all 26 keys without looking",
  icon:     "âŒ¨ï¸",
  color:    "bg-blue-500",
  lessons: [

    // â”€â”€ Lesson 1 â€” The Home Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-01-home-row",
      title:       "The Home Row",
      description: "Place your left fingers on A S D F and right fingers on J K L ; â€” this is your home base.",
      difficulty:  "BEGINNER",
      drills: [
        // 1.1
        {
          id:        "d-01-1-intro-basics",
          title:     "Touch typing basics",
          type:      "intro",
          content:   "",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 0,
          starsThresholds: [],
          pages: [
            {
              title:   "What Is Touch Typing?",
              titleBn: "টাচ টাইপিং কী?",
              body:    "What Is Touch Typing?:\n\"Touch typing\" lets you type quickly and accurately using all 10 fingers â€” without ever looking at the keyboard.\n\nWhat You Will Learn:\n\u2022 Type faster using all 10 fingers\n\u2022 Type without errors\n\u2022 Never look at the keyboard again\n\u2022 Build better computing habits\n\nWhy It Matters:\nYou will type documents and emails much faster with fewer mistakes â€” saving hours every week and making typing genuinely enjoyable.",
              bodyBn:  "টাচ টাইপিং কী?:\n\"টাচ টাইপিং\" হলো কীবোর্ডের দিকে না তাকিয়ে সব ১০টি আঙুল ব্যবহার করে দ্রুত ও নির্ভুলভাবে টাইপ করার কৌশল।\n\nএই কোর্সে যা শিখবেন:\n\u2022 ১০ আঙুল ব্যবহার করে দ্রুত টাইপ করা\n\u2022 কম ভুল করে টাইপ করা\n\u2022 কীবোর্ড না দেখে টাইপ করা\n\u2022 আরও ভালো কম্পিউটার ব্যবহারের অভ্যাস গড়া\n\nকেন এটি গুরুত্বপূর্ণ:\nএতে আপনি ডকুমেন্ট, মেসেজ ও ইমেইল অনেক দ্রুত লিখতে পারবেন, সময় বাঁচবে, আর টাইপিং আরও আনন্দদায়ক হবে।",
            },
            {
              title:   "Finger Positions",
              titleBn: "আঙুলের অবস্থান",
              body:    "Your Starting Position:\nIn their basic position, your fingers rest on the middle row â€” also called the \"home row\". This is your base for reaching all other keys.\n\nPlace Your Fingers Now:\n1. Left fingers on keys A  S  D  F\n2. Right fingers on keys J  K  L  ;\n3. Both thumbs resting on the Space bar\n4. Wrists straight, fingers lightly curled\n\nTip! Can you feel the small bumps on F and J? They help you find the home row without looking.",
              bodyBn:  "শুরুর অবস্থান:\nআপনার আঙুলগুলো কীবোর্ডের মাঝের সারিতে থাকবে, যেটাকে \"হোম রো\" বলা হয়। এখান থেকেই অন্য সব কী-তে পৌঁছানো সহজ হয়।\n\nএখন আঙুল রাখুন:\n১. বাম হাতের আঙুল A S D F কী-তে\n২. ডান হাতের আঙুল J K L ; কী-তে\n৩. দুই বুড়ো আঙুল স্পেস বারে\n৪. কবজি সোজা রাখুন, আঙুল হালকা বাঁকানো\n\nটিপ: F আর J কী-তে ছোট উঁচু দাগ আছে। এগুলো না দেখেও হোম রো খুঁজে পেতে সাহায্য করে।",
              highlightKeys: ["a","s","d","f","j","k","l",";"],
              leftHandImg:   "left-home-row-2",
              rightHandImg:  "right-home-row-2",
            },
            {
              title:   "Pressing Keys",
              titleBn: "কী চাপার পদ্ধতি",
              body:    "The Rule:\nEach key is pressed by the nearest home-row finger. After pressing any key, return your finger to its home position immediately.\n\nExample â€” How to Type A:\n1. Make sure your fingers are on the home row\n2. Your left pinky naturally rests on A\n3. Press A with a quick, light touch\n4. Return your pinky to A right away\n\nThe Space Bar:\n\u2022 Use your right thumb for the space bar\n\u2022 Left-handed? Use your left thumb instead\n\u2022 Choose one thumb and always stick with it\n\u2022 Never use both thumbs at the same time",
              bodyBn:  "নিয়মটি হলো:\nপ্রতিটি কী হোম রো-এর সবচেয়ে কাছের আঙুল দিয়ে চাপতে হবে। কোনো কী চাপার পর আঙুলকে সঙ্গে সঙ্গে হোম পজিশনে ফিরিয়ে আনুন।\n\nউদাহরণ — A টাইপ করা:\n১. আঙুল হোম রো-তে আছে কি না নিশ্চিত করুন\n২. বাম হাতের কনিষ্ঠ আঙুল স্বাভাবিকভাবেই A-তে থাকে\n৩. হালকা করে A চাপুন\n৪. সঙ্গে সঙ্গে আঙুল A-তে ফিরিয়ে আনুন\n\nস্পেস বার:\n\u2022 ডান বুড়ো আঙুল দিয়ে স্পেস চাপুন\n\u2022 আপনি বাঁহাতি হলে বাম বুড়ো আঙুলও ব্যবহার করতে পারেন\n\u2022 একটি আঙুল বেছে নিন এবং সেটাই নিয়মিত ব্যবহার করুন\n\u2022 একই সঙ্গে দুই বুড়ো আঙুল ব্যবহার করবেন না",
              highlightKeys: ["a"],
              leftHandImg:   "left-home-row-5",
            },
            {
              title:   "Learning Tips",
              titleBn: "শেখার টিপস",
              body:    "Eyes on the Monitor:\nYou learn key positions much faster when you resist peeking at the keyboard while training. Trust your fingers!\n\nKeep Wrists Up:\nResting wrists on the desk creates an awkward angle â€” fingers are harder to move, errors increase and speed drops. Keep wrists elevated.\n\nFocus on Accuracy:\n\u2022 Accuracy is the foundation of fast typing\n\u2022 Speed builds naturally with practice\n\u2022 Aim for high accuracy before chasing WPM\n\u2022 You will have an accuracy target in every drill",
              bodyBn:  "মনিটরের দিকে তাকান:\nঅনুশীলনের সময় কীবোর্ডের দিকে না তাকালে কী-এর অবস্থান অনেক দ্রুত মনে থাকে। আঙুলের উপর ভরসা রাখুন।\n\nকবজি উঁচু রাখুন:\nকবজি ডেস্কে রেখে টাইপ করলে আঙুল নড়ানো কঠিন হয়, ভুল বাড়ে এবং গতি কমে। তাই কবজি হালকা উঁচু রাখুন।\n\nনির্ভুলতায় মনোযোগ দিন:\n\u2022 নির্ভুলতাই দ্রুত টাইপিংয়ের ভিত্তি\n\u2022 নিয়মিত অনুশীলনে গতি নিজে থেকেই বাড়ে\n\u2022 WPM-এর আগে নির্ভুলতা বাড়ানোর চেষ্টা করুন\n\u2022 প্রতিটি ড্রিলে আপনার নির্ভুলতার একটি লক্ষ্য থাকবে",
            },
            {
              title:   "Ready to Start",
              titleBn: "শুরু করার জন্য প্রস্তুত",
              body:    "Posture Checklist:\n\u2022 Sit up straight, elbows close to your body\n\u2022 Keep shoulders, arms and hands relaxed\n\u2022 Eyes on the screen â€” never on the keyboard\n\u2022 Fingers resting lightly on the home row\n\nTaking Breaks:\n\u2022 Rest between exercises to stay sharp\n\u2022 Do only 1\u20132 lessons per day\n\u2022 Short daily sessions beat long marathons\n\nYou are ready!\nPress Forward below to begin your first key drill and start your touch typing journey!",
              bodyBn:  "ভঙ্গির চেকলিস্ট:\n\u2022 সোজা হয়ে বসুন, কনুই শরীরের কাছে রাখুন\n\u2022 কাঁধ, বাহু ও হাত শিথিল রাখুন\n\u2022 চোখ স্ক্রিনে রাখুন, কীবোর্ডে নয়\n\u2022 আঙুল হোম রো-তে হালকা করে রাখুন\n\nবিরতি নেওয়ার নিয়ম:\n\u2022 অনুশীলনের মাঝে ছোট বিরতি নিন\n\u2022 দিনে ১–২টির বেশি লেসন না করাই ভালো\n\u2022 প্রতিদিন অল্প সময়ের অনুশীলন দীর্ঘ সেশনের চেয়ে বেশি কার্যকর\n\nআপনি প্রস্তুত!\nনিচের সামনে যান বাটন চাপুন এবং আপনার প্রথম কী ড্রিল শুরু করুন।",
            },
          ],
        },
        // 1.2
        {
          id:        "d-01-2-intro-homerow",
          title:     "New keys: Home row",
          type:      "intro",
          content:   "",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 0,
          starsThresholds: [],
          pages: [
            // Step 1 â€” overview: all home row keys
            {
              title:   "The Home Row Keys",
              titleBn: "হোম রো কীসমূহ",
              body:    "In this lesson you will learn the home row.\n\nThe 8 home row keys are:\nA  S  D  F  â€”  J  K  L  ;\n\nThese are your anchor keys. Every other key on the keyboard is reached by stretching from this row â€” and your fingers always return here.",
              bodyBn:  "এই পাঠে আপনি হোম রো শিখবেন।\n\n৮টি হোম রো কী হলো:\nA  S  D  F  —  J  K  L  ;\n\nএগুলো আপনার মূল ভিত্তির কী। কীবোর্ডের অন্য সব কী এই সারি থেকে পৌঁছে চাপা হয়, আর আঙুল সবসময় আবার এখানেই ফিরে আসে।",
              highlightKeys: ["a","s","d","f","j","k","l",";"],
              leftHandImg:   "left-home-row-2",
              rightHandImg:  "right-home-row-2",
            },
            // Step 2 â€” left hand placement
            {
              title:   "Place Your Left Hand",
              titleBn: "বাম হাত বসান",
              body:    "Left hand â€” starting from the little finger:\n\u2022 Pinky        â†’  A\n\u2022 Ring finger  â†’  S\n\u2022 Middle finger â†’  D\n\u2022 Index finger  â†’  F\n\nLet your fingers rest lightly on the keys. Do not press â€” just touch.",
              bodyBn:  "বাম হাত — কনিষ্ঠ আঙুল থেকে শুরু করুন:\n\u2022 কনিষ্ঠ আঙুল → A\n\u2022 অনামিকা → S\n\u2022 মধ্যমা → D\n\u2022 তর্জনী → F\n\nআঙুলগুলো কী-এর উপর হালকা করে রাখুন। চাপ দেবেন না, শুধু স্পর্শ করুন।",
              highlightKeys: ["a","s","d","f"],
              leftHandImg:   "left-home-row-2",
              rightHandImg:  "right-resting-hand",
            },
            // Step 3 â€” right hand placement
            {
              title:   "Place Your Right Hand",
              titleBn: "ডান হাত বসান",
              body:    "Right hand â€” starting from the index finger:\n\u2022 Index finger  â†’  J\n\u2022 Middle finger â†’  K\n\u2022 Ring finger   â†’  L\n\u2022 Pinky         â†’  ;\n\nCan you feel the small raised bump on J? It marks your index finger's anchor key.",
              bodyBn:  "ডান হাত — তর্জনী থেকে শুরু করুন:\n\u2022 তর্জনী → J\n\u2022 মধ্যমা → K\n\u2022 অনামিকা → L\n\u2022 কনিষ্ঠ আঙুল → ;\n\nJ কী-তে ছোট উঁচু দাগ আছে। এটি আপনার তর্জনীর মূল চিহ্ন।",
              highlightKeys: ["j","k","l",";"],
              leftHandImg:   "left-resting-hand",
              rightHandImg:  "right-home-row-2",
            },
            // Step 4 â€” space bar
            {
              title:   "The Space Bar",
              titleBn: "স্পেস বার",
              body:    "Let your thumbs rest gently on the Space bar.\n\nRule: Always use the same thumb for the space bar â€” right thumb is recommended.\n\nNever use both thumbs at the same time. Pick one and stick with it.",
              bodyBn:  "দুই বুড়ো আঙুল স্পেস বারে হালকা করে রাখুন।\n\nনিয়ম: স্পেস বারের জন্য সবসময় একই বুড়ো আঙুল ব্যবহার করুন — ডান বুড়ো আঙুল সবচেয়ে ভালো।\n\nএকসঙ্গে দুই বুড়ো আঙুল ব্যবহার করবেন না। একটি বেছে নিন এবং সেটাই নিয়মিত ব্যবহার করুন।",
              highlightKeys: [" "],
              leftHandImg:   "left-resting-hand",
              rightHandImg:  "space",
            },
            // Step 5 â€” basic position (both hands)
            {
              title:   "The Basic Position",
              titleBn: "মৌলিক অবস্থান",
              body:    "Now your hands are in the basic position.\n\nLeft fingers:   A  S  D  F\nRight fingers:  J  K  L  ;\nBoth thumbs:    Space bar\n\nThis is your home. Every keystroke starts here and ends here. Keep your wrists lifted slightly off the desk.",
              bodyBn:  "এখন আপনার হাত মৌলিক অবস্থানে আছে।\n\nবাম আঙুল: A  S  D  F\nডান আঙুল: J  K  L  ;\nদুই বুড়ো আঙুল: স্পেস বার\n\nএটাই আপনার মূল ঘর। প্রতিটি কীস্ট্রোক এখান থেকে শুরু হবে এবং এখানেই ফিরে আসবে। কবজি হালকা উঁচু রাখুন।",
              highlightKeys: ["a","s","d","f","j","k","l",";"],
              leftHandImg:   "left-home-row-2",
              rightHandImg:  "right-home-row-2",
            },
          ],
        },
        // 1.3
        {
          id:        "d-01-3-key",
          title:     "New Key Home Row (ASDF-JKL; Enter)",
          type:      "key",
          content:   "f j f j a f j a s f j a s d f j a s d k f j a s d k l f j a s d k l ; f j a s d k l ; f j a s d k l ;",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 10,
          hint:      "Left fingers rest on A S D F. Right fingers rest on J K L ; â€” never look at the keys!",
          starsThresholds: stars(10,98, 6,92, 3,80),
        },
        // 1.4
        {
          id:        "d-01-4-falling",
          title:     "Falling Letters (ASDF JKL;)",
          type:      "falling",
          content:   "a s d f j k l ; f j d k s l a ; j f k d l s ; a f f j j d d k k s s l l a a ; ;",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 12,
          starsThresholds: stars(12,98, 8,90, 4,80),
        },
        // 1.5
        {
          id:        "d-01-3-intro-results",
          title:     "Understanding results",
          type:      "intro",
          content:   "",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 0,
          starsThresholds: [],
          pages: [
            {
              title:   "Understanding Your Results",
              titleBn: "ফলাফল বোঝা",
              body:    "After each drill you will see two key measurements:\n\nWPM \u2014 Words Per Minute\nThis is your typing speed. One \"word\" = 5 characters (including spaces). A beginner typically starts at 10\u201320 WPM. With practice, 60+ WPM is achievable.\n\nAccuracy\nThis is the percentage of keystrokes you typed correctly. Always aim for accuracy before speed. Typing at 95%+ accuracy is more important than going fast with many mistakes.\n\nStars\n\u2605\u2605\u2605 Three stars = excellent speed AND accuracy\n\u2605\u2605\u2606 Two stars = good \u2014 keep practising\n\u2605\u2606\u2606 One star = completed \u2014 try again to improve\n\nTip: Focus on hitting the right keys first. Speed comes naturally as accuracy builds.",
              bodyBn:  "প্রতিটি ড্রিল শেষ হলে আপনি দুটি গুরুত্বপূর্ণ পরিমাপ দেখবেন:\n\nWPM — প্রতি মিনিটে শব্দ\nএটি আপনার টাইপিং গতি। একটি \"শব্দ\" = ৫টি অক্ষর (স্পেসসহ)। একজন শিক্ষানবিশ সাধারণত ১০–২০ WPM থেকে শুরু করে। নিয়মিত অনুশীলনে ৬০+ WPM অর্জন করা সম্ভব।\n\nনির্ভুলতা\nআপনি কত শতাংশ কী সঠিকভাবে চাপছেন, সেটাই নির্ভুলতা। গতির আগে সবসময় নির্ভুলতাকে গুরুত্ব দিন। ৯৫%+ নির্ভুলতা নিয়ে টাইপ করা, অনেক ভুল নিয়ে দ্রুত টাইপ করার চেয়ে বেশি গুরুত্বপূর্ণ।\n\nতারা\n★★★ তিন তারা = গতি এবং নির্ভুলতা দুটোই চমৎকার\n★★☆ দুই তারা = ভালো — আরও অনুশীলন করুন\n★☆☆ এক তারা = সম্পন্ন — আরও উন্নতির জন্য আবার চেষ্টা করুন\n\nটিপ: প্রথমে সঠিক কী চাপায় মনোযোগ দিন। নির্ভুলতা বাড়লে গতি স্বাভাবিকভাবেই বাড়বে।",
            },
          ],
        },
        // 1.5
        {
          id:        "d-01-5-pairs",
          title:     "Home Row Pairs & Groups",
          type:      "pairs",
          content:   "aa ss dd ff jj kk ll ;; as df jk l; asd fds jkl lkj asdf jkl; fdsa ;lkj asjk dfl; asdfjkl; ;lkjfdsa aa ss dd ff jj kk ll ;; as df jk l; asd fds jkl lkj asdf jkl; fdsa ;lkj asjk dfl; asdfjkl; ;lkjfdsa aa ss dd ff jj kk ll ;; as df jk l; asd fds jkl lkj asdf jkl; fdsa ;lkj asjk dfl; asdfjkl;",
          difficulty:"BEGINNER",
          timeLimit: 300,
          targetWpm: 10,
          hint:      "Type each pair and group steadily — use the correct finger for every key!",
          starsThresholds: stars(10,97, 6,90, 3,80),
        },
        // 1.6
        {
          id:        "d-01-6-word",
          title:     "Word drill",
          type:      "word",
          content:   "sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj sad lad asks dad all lads ask dad all fall flask adds fad as df jk l; asdf jkl; fdsa ;lkj",
          difficulty:"BEGINNER",
          timeLimit: 240,
          targetWpm: 12,
          hint:      "Rhythm home-row drill (3–5 min) — use only A S D F J K L ; and Space.",
          starsThresholds: stars(12,97, 8,90, 4,78),
        },
        // 1.7
        {
          id:        "d-01-6b-sentence",
          title:     "Sentence drill",
          type:      "sentence",
          content:   "sad lad asks dad\nall lads add flask\na lass asks dad\nfad falls as lads ask\ndad asks a sad lass\nall dads add flask",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 13,
          hint:      "Type one sentence per line, then press Enter to move to the next line.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        // 1.8
        {
          id:        "d-01-7-intro-shift",
          title:     "Using Shift for capitals",
          type:      "intro",
          content:   "",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 0,
          starsThresholds: [],
          pages: [
            {
              title:   "Using Shift for Capitals",
              titleBn: "বড় হাতের অক্ষরের জন্য Shift",
              body:    "Before the paragraph drill, learn one new habit:\n\n• Hold Shift while pressing the first letter of a sentence to make it capital.\n• Try to use the opposite hand for Shift.\n• Release Shift right after the capital letter.\n\nIn the next drill, each sentence starts with a capital letter, uses periods and commas where needed, and each short paragraph ends with Enter.",
              bodyBn:  "প্যারাগ্রাফ ড্রিল শুরু করার আগে একটি নতুন অভ্যাস শিখুন:\n\n• কোনো বাক্যের প্রথম অক্ষর বড় হাতের করতে হলে সেই অক্ষর চাপার সময় Shift ধরে রাখুন।\n• সম্ভব হলে বিপরীত হাতের Shift ব্যবহার করুন।\n• বড় হাতের অক্ষর টাইপ করার সাথে সাথেই Shift ছেড়ে দিন।\n\nপরের ড্রিলে প্রতিটি বাক্য বড় হাতের অক্ষর দিয়ে শুরু হবে, দরকার হলে ফুলস্টপ ও কমা ব্যবহার হবে, আর ছোট প্যারাগ্রাফ শেষ হলে Enter চাপতে হবে।",
              visualGuide: "shift-punctuation",
            },
          ],
        },
        // 1.9
        {
          id:        "d-01-7-paragraph",
          title:     "Paragraph drill",
          type:      "paragraph",
          content:   "A sad lad asks dad, all lads add flasks.\nA lass asks dad, dad adds a flask.\nAll dads ask a lad, a flask falls.\nA sad lass asks dad, all lads add salad.\nDad asks all lads, a sad lass adds a flask.\nA lad asks dad, a lass adds flasks.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 15,
          hint:      "Use Shift for each capital letter, type periods and commas carefully, then press Enter for the next paragraph.",
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-01-11-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ;", // letters
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
      ],
    },

    // â”€â”€ Lesson 2 â€” Keys E and I â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-02-e-i",
      title:       "Keys E and I",
      description: "E is typed with your left middle finger reaching up from D. I is typed with your right middle finger reaching up from K.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-02-1-key",
          title:     "Key Drill: e i",
          type:      "key",
          content:   "d e d e d e k i k i k i de ed ki ik dei iek edi ikd dede kiki",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 12,
          hint:      "Middle finger up from D reaches E. Middle finger up from K reaches I.",
          starsThresholds: stars(12,97, 8,90, 4,78),
        },
        {
          id:        "d-02-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "e i d k a s l f e i de ki ed ik eik ide slide idle idea",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 13,
          hint:      "Eyes up, type each falling letter quickly, and return fingers to home row after every reach.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-02-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "de ed di id ke ek ki ik ei ie se es li il ad da",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 13,
          hint:      "Keep the rhythm steady: tap two-letter chunks cleanly without looking down.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-02-4-word",
          title:     "Word Drill: E and I Words",
          type:      "word",
          content:   "idea idle side slide seed skill disk lake sail skied sealed alias",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 14,
          starsThresholds: stars(14,97, 9,90, 5,78),
        },
        {
          id:        "d-02-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "A skill is ideal. I slide a disk. Li is safe. A side seed is fine. I deal a seal.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 16,
          starsThresholds: stars(16,96, 11,88, 6,76),
        },
        {
          id:        "d-02-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "A skill is ideal, I slide a disk.\nLi is safe, a side seed is fine.\nI deal a seal, a lad likes a ski.\nA lass slides a sled, I feel at ease.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 15,
          hint:      "Use Shift for capitals, keep commas and periods accurate, then press Enter for the next line.",
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-02-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
      ],
    },

    // â”€â”€ Lesson 3 â€” Keys R and U â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-03-r-u",
      title:       "Keys R and U",
      description: "R is reached with your left index finger stretching up from F. U is reached with your right index finger stretching up from J.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-03-1-key",
          title:     "Key Drill: r u",
          type:      "key",
          content:   "f r f r f r j u j u j u fr rf ju uj frf juj rfu ujr rfr uju",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 12,
          hint:      "Index finger stretches up from F to reach R. Right index stretches up from J to reach U.",
          starsThresholds: stars(12,97, 8,90, 4,78),
        },
        {
          id:        "d-03-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "r u f j a s d k l ; e i r u fr ju ru ur true sure rule user",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 14,
          hint:      "Track letters from top to bottom and keep fingers returning to home row.",
          starsThresholds: stars(14,97, 10,90, 5,78),
        },
        {
          id:        "d-03-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "fr rf ju uj ru ur ar ra su us dr rd uk ku lr rl",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 14,
          hint:      "Type each pair as one rhythm unit and keep movement light.",
          starsThresholds: stars(14,97, 10,90, 5,78),
        },
        {
          id:        "d-03-4-word",
          title:     "Word Drill: R and U Words",
          type:      "word",
          content:   "rule sure user pure rural urge true use rise lure rude rush",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-03-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "I use a ruler. A sure user is rare. Ria rides a rural route. We reuse a pure jar.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 17,
          starsThresholds: stars(17,96, 12,88, 7,76),
        },
        {
          id:        "d-03-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "I use a ruler, a sure user is rare.\nRia rides a rural route, we reuse a pure jar.\nA user sure is wise, our rise is real.\nRaju uses a ruler, I write with ease.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 16,
          hint:      "Keep capital letters, commas, and periods accurate while maintaining smooth rhythm.",
          starsThresholds: stars(16,97, 11,90, 6,78),
        },
        {
          id:        "d-03-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 16,
          starsThresholds: stars(16,97, 11,90, 6,78),
        },
      ],
    },

    // â”€â”€ Lesson 4 â€” Keys T and O â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-04-t-o",
      title:       "Keys T and O",
      description: "T is reached with your left index finger. O is reached with your right ring finger stretching up from L.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-04-1-key",
          title:     "Key Drill: t o",
          type:      "key",
          content:   "f t f t f t l o l o l o ft tf lo ol ftf lol tfo olt fto",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "Left index reaches T from F. Right ring finger reaches O from L.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-04-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "t o f l a s d j k ; e i r u t o to ot ft lo tool stool total",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 15,
          hint:      "Focus on fast recognition and return each finger to home row after every reach.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-04-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "to ot ft tf lo ol at ta so os do od jo oj ro or",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          hint:      "Type two-letter pairs smoothly and keep a steady rhythm.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-04-4-word",
          title:     "Word Drill: T and O Words",
          type:      "word",
          content:   "tool too lot root total stool stone toast motor rotor foot",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 16,
          starsThresholds: stars(16,97, 11,90, 6,78),
        },
        {
          id:        "d-04-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "I took the tool. The store is too hot. Roto uses a motor. A total score is good.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 18,
          starsThresholds: stars(18,96, 13,88, 7,76),
        },
        {
          id:        "d-04-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "I took the tool, the store is too hot.\nRoto uses a motor, a total score is good.\nA soft stool is at the door, I sit to rest.\nThe road to town is short, I go at ease.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 17,
          hint:      "Keep capitals and punctuation accurate while preserving typing flow.",
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
        {
          id:        "d-04-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 17,
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
      ],
    },

    // â”€â”€ Lesson 5 â€” Capital Letters and Period â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-05-capitals-period",
      title:       "Capital Letters and Period",
      description: "Use Shift for single capital letters and Caps Lock for a run of uppercase text. The period (.) is typed with your right ring finger reaching down from L.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-05-0-intro-shift-caps",
          title:     "Shift and Caps Lock Basics",
          type:      "intro",
          content:   "",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 0,
          starsThresholds: [],
          pages: [
            {
              title:   "Shift vs Caps Lock",
              titleBn: "Shift আর Caps Lock ব্যবহারের নিয়ম",
              body:    "Use Shift for one capital letter (example: Name, First word of a sentence).\n\nUse Caps Lock when you need many capital letters continuously (example: headings or short codes).\n\nTip: After typing capitals with Caps Lock, press Caps Lock again to turn it off and continue normal typing.",
              bodyBn:  "একটি বড় হাতের অক্ষরের জন্য Shift ব্যবহার করুন (যেমন: নাম, বাক্যের প্রথম শব্দ)।\n\nএকটানা অনেক বড় হাতের অক্ষর টাইপ করতে হলে Caps Lock ব্যবহার করুন (যেমন: শিরোনাম বা ছোট কোড)।\n\nটিপস: Caps Lock দিয়ে টাইপ শেষ হলে আবার Caps Lock চাপুন, তাহলে ছোট হাতের টাইপে ফিরে আসবেন।",
              visualGuide: "shift-punctuation",
            },
          ],
        },
        {
          id:        "d-05-1-key",
          title:     "Key Drill: Shift/Caps + period",
          type:      "key",
          content:   "A S D F J K L Al As Jk Fl Sd Ka l. s. d. f. j. k. Al. As. Jf.",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 12,
          hint:      "Use Shift for single capitals. For continuous uppercase, toggle Caps Lock on, then off when done.",
          starsThresholds: stars(12,97, 8,90, 4,78),
        },
        {
          id:        "d-05-2-falling",
          title:     "Falling Letters Drill: Shift Focus",
          type:      "falling",
          content:   "a s d f j k l ; e i r u t o A S D F J K L E I",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 15,
          hint:      "When uppercase letters appear, hold Shift and press the target key once.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-05-3-pairs",
          title:     "Pairs Drill: Shift + Capital Pairs",
          type:      "pairs",
          content:   "Aa As Sa Sd Df Fj Jk Kl Li Ri Tu To Al La Si Is",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          hint:      "Press Shift only for the capital letter, then release immediately.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-05-4-word",
          title:     "Word Drill: Capitalized Words",
          type:      "word",
          content:   "Ali Sara Dora Fela Joel Karl Lisa Jeff Dale Isla Real True Fill",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 14,
          starsThresholds: stars(14,97, 9,90, 5,78),
        },
        {
          id:        "d-05-5-sentence",
          title:     "Sentence Drill: Capitals and Periods",
          type:      "sentence",
          content:   "Ali said hello. Sara liked the idea. Joel took the last seat. Dora left.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 18,
          starsThresholds: stars(18,96, 13,88, 7,76),
        },
        {
          id:        "d-05-6-paragraph",
          title:     "Paragraph Drill: Shift Capitals",
          type:      "paragraph",
          content:   "Ali said hello, Sara liked the idea.\nJoel took the last seat, Dora left early.\nRina saw a blue kite, I kept a safe pace.\nLila asked for help, Sam fixed the issue.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 17,
          hint:      "Use Shift for each capital letter at sentence start and for proper names; release Shift right after the letter.",
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
        {
          id:        "d-05-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 17,
          hint:      "For uppercase targets in this level, hold Shift and press the letter key once.",
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
      ],
    },

    // â”€â”€ Lesson 6 â€” Keys C and Comma â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-06-c-comma",
      title:       "Keys C and Comma",
      description: "C is typed with your left middle finger reaching down from D. The comma (,) is typed with your right middle finger reaching down from K.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-06-1-key",
          title:     "Key Drill: c ,",
          type:      "key",
          content:   "d c d c d c k , k , k , dc cd k, ,k cdc k,k dcd ,k, dc k,",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "Left middle finger reaches down from D to C. Right middle finger reaches down from K to comma.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-06-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "c , d k a s f j l ; e i r u t o c , cd kc c, ,c race, score,",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 15,
          hint:      "Catch each falling target quickly and keep comma timing clean.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-06-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "dc cd ck kc c, ,c ac ca ic ci oc co sc cs",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          hint:      "Type two-character chunks with consistent rhythm and precise comma reach.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-06-4-word",
          title:     "Word Drill: C Words and Comma Phrases",
          type:      "word",
          content:   "rice, ice, ace, circle, ocean, code, slice, clock, score, office, once,",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-06-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "I like coffee, rice, and ice. She scored a circle of success, of course.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 18,
          starsThresholds: stars(18,96, 13,88, 7,76),
        },
        {
          id:        "d-06-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "I like coffee, rice, and ice.\nShe scored a circle of success, of course.\nA nice clock clicks, I can focus.\nIn class, I sit close, and practice with care.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 17,
          hint:      "Keep commas and periods accurate while maintaining steady speed.",
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
        {
          id:        "d-06-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c ,",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 17,
          starsThresholds: stars(17,97, 12,90, 7,78),
        },
      ],
    },

    // â”€â”€ Lesson 7 â€” Keys G H and Apostrophe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-07-g-h-apos",
      title:       "Keys G H and Apostrophe",
      description: "G is reached with your left index finger stretching from F. H is reached with your right index finger stretching from J. The apostrophe (') sits right of the semicolon.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-07-1-key",
          title:     "Key Drill: g h '",
          type:      "key",
          content:   "f g f g j h j h fg gf jh hj fgf jhj gh hg fg' jh' g'h h'g",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "G and H are inner index-finger keys. Your right pinky reaches for the apostrophe.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-07-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "g h ' f j a s d k l ; g h gh hg he's high that's",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 15,
          hint:      "Focus on clean hits for apostrophe and keep both index fingers balanced.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-07-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "gh hg fg gf jh hj g' 'g h' 'h ag ga ah ha",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          hint:      "Type each pair as one unit and keep apostrophe taps light.",
          starsThresholds: stars(15,97, 10,90, 6,78),
        },
        {
          id:        "d-07-4-word",
          title:     "Word Drill: G H and Contractions",
          type:      "word",
          content:   "he's she'll I'd that's it's good high ghost eight rightough they'd",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-07-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "He's a great judge. She'll go high. It's a light right here. That's good.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 19,
          starsThresholds: stars(19,96, 14,88, 8,76),
        },
        {
          id:        "d-07-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "He's a great judge, she'll go high.\nIt's a light right here, that's good.\nA ghost hid at night, I held my breath.\nThey'd laugh, I'd grin, and go again.",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 18,
          hint:      "Keep apostrophes and punctuation accurate while typing smoothly.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-07-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h '",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 18,
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
      ],
    },

    // â”€â”€ Lesson 8 â€” Keys V N and Question Mark â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-08-v-n-qmark",
      title:       "Keys V N and Question Mark",
      description: "V is typed with your left index finger reaching down from F. N is typed with your right index finger reaching down from J. The question mark (?) uses Shift + /.",
      difficulty:  "BEGINNER",
      drills: [
        {
          id:        "d-08-1-key",
          title:     "Key Drill: v n ?",
          type:      "key",
          content:   "f v f v j n j n fv vf jn nj fvf jnj vn nv? fv? jn? v? n?",
          difficulty:"BEGINNER",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "Left index reaches down to V. Right index reaches down to N. Shift+/ gives ?",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-08-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "v n ? f j a s d k l ; v n vn nv even never venue?",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 16,
          hint:      "Use Shift + / quickly for ? targets and return to home row.",
          starsThresholds: stars(16,97, 11,90, 6,78),
        },
        {
          id:        "d-08-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "vn nv fv vf jn nj v? ?v n? ?n an na en ne",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 16,
          hint:      "Keep two-letter pairs snappy; add Shift only for question marks.",
          starsThresholds: stars(16,97, 11,90, 6,78),
        },
        {
          id:        "d-08-4-word",
          title:     "Word Drill: V and N Words",
          type:      "word",
          content:   "vine,iven, never, novel, venue, invent, olive, nation, nerve, eleven,",
          difficulty:"BEGINNER",
          timeLimit: 90,
          targetWpm: 15,
          starsThresholds: stars(15,97, 10,90, 5,78),
        },
        {
          id:        "d-08-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "Have you ever driven to Nevada? No? Never visit in November? I've never gone.",
          difficulty:"BEGINNER",
          timeLimit: 120,
          targetWpm: 19,
          starsThresholds: stars(19,96, 14,88, 8,76),
        },
        {
          id:        "d-08-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "Have you ever driven to Nevada?\nNo? Never visit in November?\nI've never gone, but I've seen videos.\nIsn't that a fine evening view?",
          difficulty:"BEGINNER",
          timeLimit: 150,
          targetWpm: 18,
          hint:      "Use Shift + / for question marks and keep sentence rhythm steady.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-08-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h ' v n ?",
          difficulty:"BEGINNER",
          timeLimit: 0,
          targetWpm: 18,
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
      ],
    },

    // â”€â”€ Lesson 9 â€” Keys W and M â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-09-w-m",
      title:       "Keys W and M",
      description: "W is reached with your left ring finger stretching up from S. M is reached with your right index finger stretching down and right from J.",
      difficulty:  "INTERMEDIATE",
      drills: [
        {
          id:        "d-09-1-key",
          title:     "Key Drill: w m",
          type:      "key",
          content:   "s w s w j m j m sw ws jm mj sws jmj wm mw sw jm wm sw mw",
          difficulty:"INTERMEDIATE",
          timeLimit: 60,
          targetWpm: 14,
          hint:      "Left ring finger reaches up from S to W. Right index finger sweeps down-right to M.",
          starsThresholds: stars(14,97, 10,90, 5,78),
        },
        {
          id:        "d-09-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "w m s j a d f k l ; w m wm mw swim warm",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 18,
          hint:      "Hit W and M quickly without overreaching from home row.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-09-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "sw ws jm mj wm mw aw wa em me om mo",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 18,
          hint:      "Keep pair rhythm steady and avoid finger tension on W reaches.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-09-4-word",
          title:     "Word Drill: W and M Words",
          type:      "word",
          content:   "swim, warm, woman, world, wisdom, market, storm, welcome, medium, reward,",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 17,
          starsThresholds: stars(17,96, 12,88, 7,76),
        },
        {
          id:        "d-09-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "We must work with more wisdom. The whole team swam more often this warm summer.",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 20,
          starsThresholds: stars(20,96, 15,88, 9,76),
        },
        {
          id:        "d-09-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "We must work with more wisdom.\nThe whole team swam more often this warm summer.\nMy mom wrote a memo, we made a welcome sign.\nA smart move now will make us stronger.",
          difficulty:"INTERMEDIATE",
          timeLimit: 150,
          targetWpm: 19,
          hint:      "Keep pace smooth and prioritize clean W and M strikes.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-09-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h ' v n ? w m",
          difficulty:"INTERMEDIATE",
          timeLimit: 0,
          targetWpm: 19,
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
      ],
    },

    // â”€â”€ Lesson 10 â€” Keys Q and P â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-10-q-p",
      title:       "Keys Q and P",
      description: "Q is reached with your left pinky stretching up from A. P is reached with your right pinky stretching up from ;.",
      difficulty:  "INTERMEDIATE",
      drills: [
        {
          id:        "d-10-1-key",
          title:     "Key Drill: q p",
          type:      "key",
          content:   "a q a q ; p ; p aq qa ;p p; aqa ;p; qp pq aq ;p qa p;",
          difficulty:"INTERMEDIATE",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "Pinky fingers handle Q and P â€” they need more practice reaching up.",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-10-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "q p a ; s l d k q p qp pq quick paper",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 18,
          hint:      "Stay relaxed on pinky reaches and avoid overpressing.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-10-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "aq qa ;p p; qp pq ap pa sq qs lp pl",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 18,
          hint:      "Keep pinky movement minimal and controlled for both sides.",
          starsThresholds: stars(18,97, 13,90, 8,78),
        },
        {
          id:        "d-10-4-word",
          title:     "Word Drill: Q and P Words",
          type:      "word",
          content:   "plan, quick, epic, equal, prior, quest, paper, pride, require, sequel,",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 17,
          starsThresholds: stars(17,96, 12,88, 7,76),
        },
        {
          id:        "d-10-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "The pilot prepared a proper plan. A quick pro equipped the squad for the project.",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 20,
          starsThresholds: stars(20,96, 15,88, 9,76),
        },
        {
          id:        "d-10-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "The pilot prepared a proper plan.\nA quick pro equipped the squad for the project.\nI kept a paper copy, and the setup was quiet.\nPractice with q and p will improve pinky control.",
          difficulty:"INTERMEDIATE",
          timeLimit: 150,
          targetWpm: 19,
          hint:      "Aim for precise Q/P strikes while preserving overall rhythm.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-10-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h ' v n ? w m q p",
          difficulty:"INTERMEDIATE",
          timeLimit: 0,
          targetWpm: 19,
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
      ],
    },

    // â”€â”€ Lesson 11 â€” Keys B and Y â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-11-b-y",
      title:       "Keys B and Y",
      description: "B is typed with your left index finger reaching down from F. Y is typed with your right index finger reaching up from J.",
      difficulty:  "INTERMEDIATE",
      drills: [
        {
          id:        "d-11-1-key",
          title:     "Key Drill: b y",
          type:      "key",
          content:   "f b f b j y j y fb bf jy yj fbf jyj by yb bfy yjb fby yjf",
          difficulty:"INTERMEDIATE",
          timeLimit: 60,
          targetWpm: 14,
          hint:      "Left index reaches down to B. Right index reaches up to Y â€” same finger does both.",
          starsThresholds: stars(14,97, 10,90, 5,78),
        },
        {
          id:        "d-11-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "b y f j a s d k b y by yb baby by",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 19,
          hint:      "Control index-finger travel so B and Y stay accurate at speed.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-11-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "by yb fb bf jy yj ab ba ey ye oy yo",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 19,
          hint:      "Keep both index fingers light and consistent on direction changes.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-11-4-word",
          title:     "Word Drill: B and Y Words",
          type:      "word",
          content:   "body, byte, buddy, lobby, by, boyish, busy, baby, boldly, anybody, beauty,",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 17,
          starsThresholds: stars(17,96, 12,88, 7,76),
        },
        {
          id:        "d-11-5-sentence",
          title:     "Sentence Drill",
          type:      "sentence",
          content:   "By the bay, a baby bird built a nest. Bobby already typed every byte boldly.",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 21,
          starsThresholds: stars(21,96, 15,88, 9,76),
        },
        {
          id:        "d-11-6-paragraph",
          title:     "Paragraph Drill",
          type:      "paragraph",
          content:   "By the bay, a baby bird built a nest.\nBobby already typed every byte boldly.\nA busy boy wrote a brief note, then ran by.\nYour body and rhythm improve by daily practice.",
          difficulty:"INTERMEDIATE",
          timeLimit: 150,
          targetWpm: 20,
          hint:      "Focus on clean B/Y transitions while keeping punctuation tidy.",
          starsThresholds: stars(20,97, 15,90, 9,78),
        },
        {
          id:        "d-11-7-fighter",
          title:     "Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h ' v n ? w m q p b y",
          difficulty:"INTERMEDIATE",
          timeLimit: 0,
          targetWpm: 20,
          starsThresholds: stars(20,97, 15,90, 9,78),
        },
      ],
    },

    // â”€â”€ Lesson 12 â€” Keys Z and X â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id:          "les-12-z-x",
      title:       "Keys Z and X",
      description: "Z is reached with your left pinky reaching down from A. X is reached with your left ring finger reaching down from S.",
      difficulty:  "INTERMEDIATE",
      drills: [
        {
          id:        "d-12-1-key",
          title:     "Key Drill: z x",
          type:      "key",
          content:   "a z a z s x s x az za sx xs aza sxs zx xz azs sxa zxa xza",
          difficulty:"INTERMEDIATE",
          timeLimit: 60,
          targetWpm: 13,
          hint:      "Left pinky reaches down to Z. Left ring finger reaches down to X. These are your weakest keys â€” give them extra focus!",
          starsThresholds: stars(13,97, 9,90, 5,78),
        },
        {
          id:        "d-12-2-falling",
          title:     "Falling Letters Drill",
          type:      "falling",
          content:   "z x a s d f z x zx xz zone exact",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 19,
          hint:      "Stay relaxed on left pinky/ring reaches and avoid hand twist.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-12-3-pairs",
          title:     "Pairs Drill",
          type:      "pairs",
          content:   "zx xz az za sx xs ex xe ox xo",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 19,
          hint:      "Keep left-hand motion compact for Z/X accuracy.",
          starsThresholds: stars(19,97, 14,90, 8,78),
        },
        {
          id:        "d-12-4-word",
          title:     "Word Drill: Z and X Words",
          type:      "word",
          content:   "zone, exact, froze, excel, oxide, blaze, fixed, prize, extra, six, exist,",
          difficulty:"INTERMEDIATE",
          timeLimit: 90,
          targetWpm: 17,
          starsThresholds: stars(17,96, 12,88, 7,76),
        },
        {
          id:        "d-12-5-sentence",
          title:     "Final Sentence Drill",
          type:      "sentence",
          content:   "The fox exited the zone exactly at six. Twelve zebras fixed extra exam boxes.",
          difficulty:"INTERMEDIATE",
          timeLimit: 120,
          targetWpm: 21,
          starsThresholds: stars(21,96, 16,88, 10,76),
        },
        {
          id:        "d-12-6-paragraph",
          title:     "Final Paragraph Drill",
          type:      "paragraph",
          content:   "The fox exited the zone exactly at six.\nTwelve zebras fixed extra exam boxes.\nA lazy wizard mixed text and numbers for practice.\nWith daily drills, complex keys feel easy.",
          difficulty:"INTERMEDIATE",
          timeLimit: 150,
          targetWpm: 20,
          hint:      "Prioritize precision on Z/X and keep tempo consistent.",
          starsThresholds: stars(20,97, 15,90, 9,78),
        },
        {
          id:        "d-12-7-fighter",
          title:     "Final Fighter Plane Game",
          type:      "fighter",
          content:   "a s d f j k l ; e i r u t o c , g h ' v n ? w m q p b y z x",
          difficulty:"INTERMEDIATE",
          timeLimit: 0,
          targetWpm: 20,
          starsThresholds: stars(20,97, 15,90, 9,78),
        },
      ],
    },

  ],
};

// =============================================================================
//  FULL ENGLISH COURSE
// =============================================================================

export const ENGLISH_COURSE: Course = {
  id:      "course-en-full",
  title:   "Fast Touch Typing Course",
  locale:  "en",
  modules: [FAST_TOUCH_MODULE],
};

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Flatten all drills from a course for DB seeding */
export function getAllDrills(course: Course): (Drill & { moduleId: string; lessonId: string })[] {
  return course.modules.flatMap((mod) =>
    mod.lessons.flatMap((les) =>
      les.drills.map((d) => ({ ...d, moduleId: mod.id, lessonId: les.id }))
    )
  );
}

/** Find a drill by its ID */
export function findDrill(course: Course, drillId: string): Drill | undefined {
  return getAllDrills(course).find((d) => d.id === drillId);
}

/** Get total drill count for a module */
export function moduleDrillCount(mod: Module): number {
  return mod.lessons.reduce((sum, les) => sum + les.drills.length, 0);
}

/** Calculate earned stars from WPM + Accuracy */
export function calcStars(drill: Drill, wpm: number, accuracy: number): 0 | 1 | 2 | 3 {
  for (const t of drill.starsThresholds) {
    if (wpm >= t.minWpm && accuracy >= t.minAccuracy) return t.stars;
  }
  return 0;
}

/** Calculate XP earned from a drill result */
export function calcXp(wpm: number, accuracy: number, maxCombo: number): number {
  const base   = Math.floor((wpm * accuracy) / 100);
  const combo  = Math.floor(maxCombo / 10) * 5;
  return base + combo;
}
