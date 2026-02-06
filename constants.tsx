
import { Question, Section } from './types';

export const SECTIONS: Section[] = [
  { id: 'intro', title: 'Welcome', description: 'Rediscovering Authentic Potential in the Digital Age' },
  { id: 'demographics', title: 'Basics', description: 'A little bit about you' },
  { id: 'authenticity', title: 'Self-Authentication', description: 'How do you feel about your authentic self?' },
  { id: 'digital', title: 'Digital Impact', description: 'Social media and its influence' },
  { id: 'motivation', title: 'Intrinsic Motivation', description: 'What drives you forward?' },
  { id: 'detox', title: 'Digital Detox', description: 'Your relationship with tech' },
  { id: 'reflections', title: 'Deep Reflections', description: 'Final thoughts' },
  { id: 'consent', title: 'Final Consent', description: 'Completing your contribution' },
];

export const QUESTIONS: Question[] = [
  // Demographics
  { id: 1, section: 'demographics', text: 'How old are you?', type: 'choice', options: ['18-20', '21-23', '24-26', '27-30', 'Above 30'] },
  { id: 2, section: 'demographics', text: 'What is your gender?', type: 'choice', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
  { id: 3, section: 'demographics', text: 'Current Academic Level', type: 'choice', options: ['Undergraduate', 'Postgraduate (Master\'s)', 'Doctoral', 'Other'] },
  { id: 4, section: 'demographics', text: 'Field of Study', type: 'choice', options: ['Management', 'Engineering', 'Sciences', 'Arts & Humanities', 'Other'] },
  { id: 5, section: 'demographics', text: 'Years of Social Media Use', type: 'choice', options: ['Less than 2 years', '2-5 years', '5-10 years', 'More than 10 years'] },

  // Self-Authentication (1-10)
  { id: 6, section: 'authenticity', text: 'I have a clear understanding of who I truly am beyond social media personas', type: 'scale' },
  { id: 7, section: 'authenticity', text: 'I feel authentic and genuine in my daily interactions with others', type: 'scale' },
  { id: 8, section: 'authenticity', text: 'My online persona accurately reflects my true values and beliefs', type: 'scale' },
  { id: 9, section: 'authenticity', text: 'I am aware of my core strengths and weaknesses', type: 'scale' },
  { id: 10, section: 'authenticity', text: 'I feel disconnected from my true self when using social media', type: 'scale' },
  { id: 11, section: 'authenticity', text: 'I make decisions based on my personal values rather than external pressure', type: 'scale' },
  { id: 12, section: 'authenticity', text: 'I struggle to identify my genuine interests versus what I think I should like', type: 'scale' },
  { id: 13, section: 'authenticity', text: 'I feel confident expressing my authentic opinions, even if they are unpopular', type: 'scale' },
  { id: 14, section: 'authenticity', text: 'I understand what truly motivates me in my personal and academic life', type: 'scale' },
  { id: 15, section: 'authenticity', text: 'I feel pressure to maintain a curated image on social media', type: 'scale' },

  // Digital Impact (11-20)
  { id: 16, section: 'digital', text: 'I spend significant time curating my social media content', type: 'scale' },
  { id: 17, section: 'digital', text: 'I experience anxiety when my posts don\'t receive expected engagement', type: 'scale' },
  { id: 18, section: 'digital', text: 'I compare my life to others\' social media presentations', type: 'scale' },
  { id: 19, section: 'digital', text: 'Social media use interferes with my focus on academic tasks', type: 'scale' },
  { id: 20, section: 'digital', text: 'I feel FOMO (Fear of Missing Out) when not checking social media', type: 'scale' },
  { id: 21, section: 'digital', text: 'I modify my behavior based on what I think will get likes or comments', type: 'scale' },
  { id: 22, section: 'digital', text: 'I feel more confident when receiving social validation online', type: 'scale' },
  { id: 23, section: 'digital', text: 'I use social media to escape from uncomfortable emotions', type: 'scale' },
  { id: 24, section: 'digital', text: 'My daily mood is affected by my social media interactions', type: 'scale' },
  { id: 25, section: 'digital', text: 'I have experienced stress due to cyberbullying or negative comments', type: 'scale' },

  // Motivation (21-30)
  { id: 26, section: 'motivation', text: 'I am motivated by the desire to learn and grow personally', type: 'scale' },
  { id: 27, section: 'motivation', text: 'I pursue my academic goals because they align with my values', type: 'scale' },
  { id: 28, section: 'motivation', text: 'I would continue my studies even without grades or external rewards', type: 'scale' },
  { id: 29, section: 'motivation', text: 'I feel a sense of purpose in my current pursuits', type: 'scale' },
  { id: 30, section: 'motivation', text: 'I am driven by internal satisfaction rather than external recognition', type: 'scale' },
  { id: 31, section: 'motivation', text: 'I find my academic work meaningful and worthwhile', type: 'scale' },
  { id: 32, section: 'motivation', text: 'I set my own goals rather than following what others expect', type: 'scale' },
  { id: 33, section: 'motivation', text: 'I feel intrinsically motivated to achieve excellence', type: 'scale' },
  { id: 34, section: 'motivation', text: 'My motivation comes from personal interest, not external pressure', type: 'scale' },
  { id: 35, section: 'motivation', text: 'I feel energized when working on tasks aligned with my authentic interests', type: 'scale' },

  // Digital Detox (31-35)
  { id: 36, section: 'detox', text: 'How often do you intentionally take breaks from social media?', type: 'choice', options: ['Daily', 'Several times a week', 'Weekly', 'Rarely', 'Never'] },
  { id: 37, section: 'detox', text: 'Do you have device-free times or zones in your daily routine?', type: 'choice', options: ['Yes, regularly', 'Occasionally', 'Rarely', 'Never'] },
  { id: 38, section: 'detox', text: 'Have you noticed improvements in your motivation or well-being after reducing social media use?', type: 'choice', options: ['Significant improvement', 'Some improvement', 'No change', 'Worsened'] },
  { id: 39, section: 'detox', text: 'What activities help you reconnect with your authentic self?', type: 'multi-choice', options: ['Meditation/Mindfulness', 'Exercise/Outdoor activities', 'Creative hobbies', 'Reading', 'Journaling', 'Social connections (offline)', 'Other'] },
  { id: 40, section: 'detox', text: 'How would you rate your current digital wellness?', type: 'choice', options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] },

  // Open Ended (36-40 in OCR, numbering adjusted for flow)
  { id: 41, section: 'reflections', text: 'How would you describe the relationship between your authentic self and your social media presence?', type: 'text' },
  { id: 42, section: 'reflections', text: 'What strategies have you found most effective in maintaining self-authentication in the digital age?', type: 'text' },
  { id: 43, section: 'reflections', text: 'How do you believe self-authentication impacts your academic and personal motivation?', type: 'text' },
  { id: 44, section: 'reflections', text: 'What challenges do you face in maintaining your authentic self while being connected online?', type: 'text' },
  { id: 45, section: 'reflections', text: 'What recommendations would you give to other students struggling with maintaining authenticity in the digital age?', type: 'text' },

  // Final
  { id: 46, section: 'consent', text: 'I agree to participate in this research and understand my data will be kept confidential.', type: 'consent' },
];
