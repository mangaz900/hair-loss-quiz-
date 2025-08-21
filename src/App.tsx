import React, { useState, useEffect, useCallback } from 'react';

// TypeScript declarations for global functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

const MethyleneBlueQuiz = () => {
  const [currentStep, setCurrentStep] = useState('hero');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState({
    howItWorks: true,
    coverUp: false
  });
  const [showNoThanksPopup, setShowNoThanksPopup] = useState(false);
  const [showBlogBridge, setShowBlogBridge] = useState(false);

  // Reset focus when question changes to prevent buttons from appearing selected
  useEffect(() => {
    if (currentStep === 'quiz') {
      // Remove focus from any previously focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [questionIndex, currentStep]);

  // Google Analytics 4 Tracking
  const GA_TRACKING_ID = 'G-BK1MD3C7QL';

  // Advanced tracking state
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeOnPage, setTimeOnPage] = useState<number>(0);
  const [scrollDepth, setScrollDepth] = useState<number>(0);
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Clear selected answer when question changes - using useCallback to prevent unnecessary re-renders
  const clearSelectedAnswer = useCallback(() => {
    console.log('clearSelectedAnswer called, questionIndex:', questionIndex);
    setSelectedAnswer('');
  }, [questionIndex]);

  // Also clear selectedAnswer when questionIndex changes (extra safety)
  useEffect(() => {
    console.log('useEffect: clearing selectedAnswer, questionIndex:', questionIndex);
    setSelectedAnswer('');
  }, [questionIndex]);

  // Helper function to safely call gtag
  const safeGtag = (...args: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args);
    }
  };

  // Helper function to safely call fbq
  const safeFbq = (...args: any[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq(...args);
    }
  };

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    safeGtag('event', eventName, {
      event_category: 'quiz_interaction',
      ...parameters
    });
  };

  // Enhanced tracking functions
  const trackQuestionTime = (questionId: string, timeSpent: number) => {
    safeGtag('event', 'question_time_spent', {
      question_id: questionId,
      time_spent_seconds: Math.round(timeSpent / 1000),
      content_name: 'Hair Loss Quiz',
      quiz_severity: figureOutSeverity()
    });
  };

  const trackScrollDepth = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > scrollDepth) {
      setScrollDepth(scrollPercent);
      safeGtag('event', 'scroll_depth', {
        scroll_percentage: scrollPercent,
        content_name: 'Hair Loss Quiz'
      });
    }
  };

  const trackHover = (element: string) => {
    safeGtag('event', 'element_hover', {
      element_name: element,
      content_name: 'Hair Loss Quiz'
    });
  };

  const trackInfoBoxInteraction = (infoBoxTitle: string, action: string) => {
    safeGtag('event', 'info_box_interaction', {
      info_box_title: infoBoxTitle,
      action: action,
      content_name: 'Hair Loss Quiz'
    });
  };

  // Facebook Pixel Tracking
  const trackFacebookEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    console.log('🔍 Facebook Event:', eventName, parameters);
    console.log('🔍 fbq exists?', typeof window !== 'undefined' && (window as any).fbq);
    
    if (typeof window !== 'undefined' && (window as any).fbq) {
      console.log('✅ Sending Facebook event:', eventName);
      (window as any).fbq('track', eventName, parameters);
    } else {
      console.log('❌ Facebook Pixel not found');
    }
  };

  const getAllQuestions = () => {
    let questions: Array<{
      id?: string;
      type: string;
      title: string;
      subtitle?: string;
      options?: string[];
      content?: string;
      bgColor?: string;
      textColor?: string;
    }> = [
      {
        id: 'age',
        type: 'question',
        title: 'How old are you?',
        subtitle: "(2-minute hair loss assessment - get your personal plan)",
        options: ['Under 30', '30-39', '40-49', '50-59', '60+']
      },
      {
        id: 'gender',
        type: 'question',
        title: 'Are you male or female?',
        options: ['Male', 'Female', 'Prefer not to say']
      },

      {
        id: 'main_problem',
        type: 'question',
        title: 'How does your hair loss make you feel right now?',
        options: [
          'I\'m terrified I\'ll go completely bald',
          'I avoid mirrors and photos',
          'I dread washing my hair (the clumps in the drain)',
          'I don\'t feel feminine anymore',
          'I hide my thin spots with hats/scarves',
          'I\'ve lost all confidence in how I look'
        ]
      },
      {
        id: 'life_situation',
        type: 'question',
        title: 'Which describes your situation?',
        options: [
          'I\'m postpartum and my hair is falling out in chunks',
          'I\'m going through menopause/perimenopause',
          'I have PCOS or hormonal imbalances',
          'I\'ve been under extreme stress lately',
          'I just noticed my hair getting thinner',
          'None of these apply to me'
        ]
      }
    ];

    // Add different questions based on gender (conditional logic)
    if (answers.gender === 'Female') {
      questions.push({
        id: 'hormonal_impact',
        type: 'question',
        title: 'Do you think hormones are causing your hair loss?',
        options: [
          'Yes, definitely - it started after pregnancy/menopause',
          'Yes, I think so - it coincided with hormonal changes',
          'Maybe - I\'ve heard DHT affects women too',
          'I\'m not sure what\'s causing it',
          'No, I think it\'s just stress/genetics'
        ]
      });

      questions.push({
        id: 'identity_femininity',
        type: 'question',
        title: 'How is hair loss affecting your sense of being a woman?',
        options: [
          'I don\'t feel feminine anymore',
          'I feel like I\'m aging too fast',
          'I avoid intimate situations',
          'I feel less attractive to my partner',
          'I\'m embarrassed in social situations',
          'It\'s affecting everything about how I see myself'
        ]
      });
    }

    if (answers.gender === 'Male') {
      questions.push({
        id: 'dht_awareness',
        type: 'question',
        title: 'Have you heard about DHT (the hormone that causes hair loss)?',
        options: [
          'Yes, I know DHT is the main culprit',
          'I\'ve heard of it but don\'t know much',
          'No, but I want to learn',
          'I think my hair loss is just genetic',
          'I\'m not sure what\'s causing my hair loss'
        ]
      });

      questions.push({
        id: 'treatment_willingness',
        type: 'question',
        title: 'How do you feel about taking medication for hair loss?',
        options: [
          'I want to avoid pharmaceutical drugs',
          'I\'m open to natural solutions',
          'I\'ve tried Propecia but had side effects',
          'I\'m scared of the side effects',
          'I\'ll try anything that works'
        ]
      });
    }

    // Add competitor awareness question for everyone
    questions.push({
      id: 'competitor_awareness',
      type: 'question',
      title: 'What have you already tried for your hair loss?',
      options: [
        'Expensive supplements like Nutrafol/Viviscal',
        'Minoxidil (Rogaine) but didn\'t like the side effects',
        'Biotin, collagen, and other vitamins',
        'Saw palmetto or other DHT blockers',
        'Special shampoos and topical treatments',
        'Nothing yet - this is my first attempt'
      ]
    });

    // More questions for everyone
    questions.push(
      {
        id: 'social_impact',
        type: 'question',
        title: 'How is hair loss affecting your daily life?',
        options: [
          'People at work are noticing my thin spots',
          'I check every mirror obsessively',
          'I avoid social situations and photos',
          'I spend forever styling to hide bald patches',
          'I wear hats constantly',
          'My confidence is completely shot'
        ]
      },
      {
        type: 'info',
        title: "💪 You're Not Alone",
        content:
          'Millions of women worldwide experience hair loss. The ones who get their hair back? They found what actually blocks DHT naturally and stuck with it.',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800'
      },
      {
        id: 'relationships',
        type: 'question',
        title: 'How is this affecting your relationships?',
        options: [
          'My partner tries to reassure me but I don\'t believe them',
          'I avoid intimacy because I\'m embarrassed',
          'I cancel plans because of "bad hair days"',
          'My family says I\'m obsessing over it',
          'I feel like people are staring at my scalp',
          'I don\'t feel like myself in relationships anymore'
        ]
      },
      {
        id: 'how_desperately',
        type: 'question',
        title: 'How desperately do you want to stop your hair loss?',
        options: [
          'I cry in the shower looking at hair clumps',
          'I\'ve spent hundreds on products that don\'t work',
          'I\'ve considered expensive procedures like PRP',
          'I Google "hair loss cure" every day',
          'I\'ve thought about wearing wigs',
          'I\'ve almost given up hope completely'
        ]
      },
      {
        type: 'info',
        title: "🔬 What Most Women Don't Know",
        content:
          "Your hair loss isn't \"just genetics.\" DHT hormone is literally strangling your follicles. Block the DHT naturally, and your hair can start growing again.",
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-800'
      },
      {
        id: 'how_long',
        type: 'question',
        title: 'How long has your hair been thinning?',
        options: [
          'Just started and I\'m panicking',
          'About 6 months and getting worse',
          '1-2 years and I\'m desperate',
          'Years - I\'ve tried everything',
          'Since pregnancy/menopause',
          'So long I forgot what thick hair feels like'
        ]
      },
      {
        id: 'biggest_fear',
        type: 'question',
        title: 'What\'s your biggest fear about your hair loss?',
        options: [
          'Going completely bald',
          'Looking old and unattractive',
          'My partner losing interest in me',
          'Never feeling confident again',
          'People talking about my appearance',
          'Needing to wear wigs for the rest of my life'
        ]
      },
      {
        type: 'info',
        title: '⚡ The Natural DHT Blocker That Actually Works',
        content:
          'Clinical studies show pumpkin seed oil can increase hair count by 40%. Unlike drugs, it has no side effects. Unlike expensive supplements, it targets the root cause: DHT.',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800'
      },
      {
        id: 'what_failed',
        type: 'question',
        title: 'What have you wasted money on that didn\'t work?',
        options: [
          'Nutrafol or Viviscal (expensive but no results)',
          'Minoxidil that made my scalp irritated',
          'Dozens of biotin supplements and vitamins',
          'Expensive shampoos that promised miracles',
          'Scalp treatments at salons',
          'Nothing yet - but I\'m afraid to try things'
        ]
      },

      {
        id: 'qualification_budget',
        type: 'question',
        title: 'How serious are you about stopping your hair loss?',
        options: [
          'I\'ll invest in anything that actually works',
          'I\'m ready for a real solution, not another fake promise',
          'I want to try it but money is tight',
          'I\'m comparing options right now',
          'Just researching for now'
        ]
      },
      {
        id: 'how_badly_need',
        type: 'question',
        title: 'How badly do you need this to work?',
        options: [
          'DESPERATELY - I can\'t lose any more hair',
          'Very badly - This is ruining my life',
          'Pretty badly - I need to stop this now',
          'Somewhat - I want to prevent it getting worse',
          'Just want to learn more about natural options'
        ]
      }
    );

    return questions;
  };

  // Figure out what type of person they are (avatar detection)
  const figureOutAvatar = () => {
    let scores = {
      hormonal_woman: 0,
      biohacker_man: 0,
      sick_person: 0,
      work_person: 0,
      tired_parent: 0
    } as Record<string, number>;

    // Woman going through menopause
    if (
      answers.gender === 'Female' &&
      answers.hormonal_impact &&
      (answers.hormonal_impact as string).includes('Yes, definitely')
    ) {
      scores.hormonal_woman += 4;
    }
    if (answers.identity_femininity && (answers.identity_femininity as string).includes('don\'t feel feminine')) {
      scores.hormonal_woman += 3;
    }
    if (
      answers.main_problem &&
      (answers.main_problem as string).includes("don't feel feminine")
    ) {
      scores.hormonal_woman += 2;
    }

    // Male biohacker
    if (
      answers.gender === 'Male' &&
      answers.treatment_willingness &&
      (answers.treatment_willingness as string).includes('natural solutions')
    ) {
      scores.biohacker_man += 4;
    }
    if (answers.dht_awareness && (answers.dht_awareness as string).includes('Yes, I know DHT')) {
      scores.biohacker_man += 3;
    }

    // Sick person (postpartum, menopause, etc)
    if (answers.life_situation && (answers.life_situation as string).includes('postpartum')) {
      scores.sick_person += 4;
    }
    if (
      answers.how_desperately &&
      (answers.how_desperately as string).includes('almost given up hope')
    ) {
      scores.sick_person += 3;
    }

    // Work-focused person
    if (
      answers.social_impact &&
      (answers.social_impact as string).includes('People at work are noticing')
    ) {
      scores.work_person += 3;
    }
    if (answers.biggest_fear && (answers.biggest_fear as string).includes('Looking old')) {
      scores.work_person += 2;
    }

    // Tired parent
    if (
      answers.relationships &&
      (answers.relationships as string).includes('avoid intimacy')
    ) {
      scores.tired_parent += 3;
    }

    // Return the highest scoring avatar
    return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
  };

  // Figure out how bad their problem is
  const figureOutSeverity = () => {
    let badness = 0;

    if (
      answers.main_problem &&
      ((answers.main_problem as string).includes('broken') ||
        (answers.main_problem as string).includes('losing my mind'))
    ) {
      badness += 4;
    }

    if (
      answers.how_desperately &&
      ((answers.how_desperately as string).includes('cried at doctors') ||
        (answers.how_desperately as string).includes('given up'))
    ) {
      badness += 4;
    }

    if (
      answers.social_impact &&
      ((answers.social_impact as string).includes('barely function') ||
        (answers.social_impact as string).includes('starting to notice'))
    ) {
      badness += 3;
    }

    if (answers.how_badly_need && (answers.how_badly_need as string).includes('DESPERATELY')) {
      badness += 2;
    }

    if (badness >= 10) return 'VERY BAD';
    if (badness >= 6) return 'BAD';
    if (badness >= 3) return 'NOT GOOD';
    return 'OKAY';
  };

  // Enhanced useEffect for tracking
  useEffect(() => {
    // Track page load
    safeGtag('config', GA_TRACKING_ID, {
      page_title: 'Hair Loss Quiz',
      page_location: window.location.href
    });

    // Track time on page
    const timeInterval = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, []);

  // Enhanced question tracking - moved to after currentQuestion is defined
  const trackQuestionView = (question: any, index: number) => {
    setQuestionStartTime(Date.now());
    
    // Track question view
    safeGtag('event', 'question_viewed', {
      question_id: question.id,
      question_title: question.title,
      question_number: index + 1,
      content_name: 'Hair Loss Quiz'
    });
  };

  const handleAnswer = (questionId: string, answer: string) => {
    const timeSpent = Date.now() - questionStartTime;
    
    // Track question time
    trackQuestionTime(questionId, timeSpent);
    
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Track question answer
    safeGtag('event', 'question_answered', {
      question_id: questionId,
      answer_selected: answer,
      time_spent_seconds: Math.round(timeSpent / 1000),
      question_number: questionIndex + 1,
      content_name: 'Hair Loss Quiz',
      quiz_severity: figureOutSeverity()
    });
    
    // Track Facebook Pixel
    safeFbq('track', 'ViewContent', {
      content_name: 'Hair Loss Quiz',
      quiz_severity: figureOutSeverity()
    });
    
    setTimeout(() => nextStep(), 500);
  };

  const nextStep = () => {
    if (currentStep === 'hero') {
      // Track quiz start
      safeGtag('event', 'quiz_started', {
        content_name: 'Hair Loss Quiz',
        timestamp: new Date().toISOString()
      });
      
      safeFbq('track', 'InitiateCheckout', {
        content_name: 'Hair Loss Quiz'
      });
      
      setCurrentStep('quiz');
    } else if (currentStep === 'quiz') {
      if (questionIndex < getAllQuestions().length - 1) {
        // Clear selected answer before moving to next question
        clearSelectedAnswer();
        setQuestionIndex(questionIndex + 1);
        
        // Track next question
        const nextQuestion = getAllQuestions()[questionIndex + 1];
        if (nextQuestion) {
          trackQuestionView(nextQuestion, questionIndex + 1);
        }
      } else {
        // Track quiz completion
        safeGtag('event', 'quiz_completed', {
          content_name: 'Hair Loss Quiz',
          quiz_severity: figureOutSeverity(),
          total_questions: getAllQuestions().length,
          time_on_page_seconds: timeOnPage
        });
        
        safeFbq('track', 'CompleteRegistration', {
          content_name: 'Hair Loss Quiz',
          quiz_severity: figureOutSeverity()
        });
        
        setIsAnalyzing(true);
        setCurrentStep('analysis');
        
        // Start the proper analysis sequence
        startAnalysis();
      }
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);

    const steps = [
      '🧠 Looking at your answers...',
      '⚡ Checking how bad your hair loss is...',
      '📊 Figuring out the best plan for you...',
      '🎯 Finding what will work for your situation...',
      '✅ Making your personal plan...'
    ];

    let step = 0;
    
    // Show first step immediately
    setAnalysisStep(step);
    console.log(`Starting analysis - Step ${step}: ${steps[step]}`);
    
    // Function to show next step
    const showNextStep = () => {
      step++;
      
      if (step < steps.length) {
        setAnalysisStep(step);
        console.log(`Showing analysis step ${step}: ${steps[step]}`);
        
        // Schedule next step
        setTimeout(showNextStep, 3000);
      } else {
        console.log('Analysis complete, showing final step for 3 seconds...');
        
        // Show final step for 3 seconds, then go to results
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResult(true);
          
          // Track quiz completion
          safeGtag('event', 'quiz_completed', {
            content_name: 'Hair Loss Quiz',
            quiz_severity: figureOutSeverity(),
            total_questions: getAllQuestions().length,
            answers_count: Object.keys(answers).length,
            time_on_page_seconds: timeOnPage
          });

          // Facebook Pixel: Custom quiz_completed event
          console.log('🔍 About to send quiz_completed event...');
          console.log('🔍 Current severity:', figureOutSeverity());
          console.log('🔍 Total questions:', getAllQuestions().length);
          console.log('🔍 Answers count:', Object.keys(answers).length);
          
          safeFbq('track', 'CompleteRegistration', {
            content_name: 'Hair Loss Quiz',
            quiz_severity: figureOutSeverity(),
            total_questions: getAllQuestions().length,
            answers_count: Object.keys(answers).length
          });
          
          console.log('✅ quiz_completed event sent!');
        }, 3000); // Show final step for 3 seconds
      }
    };
    
    // Start the sequence after 3 seconds
    setTimeout(showNextStep, 3000);
  };

  const handleCTAClick = () => {
    safeGtag('event', 'cta_clicked', {
      cta_location: 'main_results',
      content_name: 'Hair Loss Quiz',
      quiz_severity: figureOutSeverity(),
      time_on_page_seconds: timeOnPage,
      scroll_depth_percentage: scrollDepth,
      interaction_count: interactionCount
    });

    safeFbq('track', 'AddToWishlist', {
      content_name: 'Hair Loss Quiz',
      quiz_severity: figureOutSeverity()
    });
  };

  const startQuiz = () => {
    // Track quiz start button click
    safeGtag('event', 'quiz_start_button_clicked', {
      content_name: 'Hair Loss Quiz',
      button_location: 'hero_section',
      timestamp: new Date().toISOString()
    });
    
    safeFbq('track', 'Lead', {
      content_name: 'Hair Loss Quiz'
    });
    
    nextStep();
  };

  // Enhanced quiz rendering with tracking
  const renderQuiz = () => {
    const currentQuestion = getAllQuestions()[questionIndex];
    
    if (!currentQuestion) return null;
    
    // Track question view when rendering
    if (currentStep === 'quiz') {
      trackQuestionView(currentQuestion, questionIndex);
    }

    if (currentQuestion.type === 'question') {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center"
            onMouseEnter={() => trackHover('question_title')}
          >
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p 
              className="text-gray-600 mb-6 sm:mb-8 text-center text-base sm:text-lg"
              onMouseEnter={() => trackHover('question_subtitle')}
            >
              {currentQuestion.subtitle}
            </p>
          )}
          <div className="space-y-4">
            {currentQuestion.options?.map((option: string, index: number) => (
              <button
                key={index}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-lg"
                onClick={() => handleAnswer((currentQuestion as any).id, option)}
                onMouseEnter={() => trackHover(`answer_option_${index + 1}`)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div 
          className={`${(currentQuestion as any).bgColor} rounded-2xl p-6 sm:p-8 text-center`}
          onMouseEnter={() => trackHover('info_box')}
          onClick={() => trackInfoBoxInteraction((currentQuestion as any).title, 'viewed')}
        >
          <h2 className={`text-xl sm:text-2xl font-bold ${(currentQuestion as any).textColor} mb-4 sm:mb-6`}>
            {(currentQuestion as any).title}
          </h2>
          <p className={`${(currentQuestion as any).textColor} text-base sm:text-lg leading-relaxed mb-6 sm:mb-8`}>
            {(currentQuestion as any).content}
          </p>
          <button
            className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {
              trackInfoBoxInteraction((currentQuestion as any).title, 'continued');
              nextStep();
            }}
            onMouseEnter={() => trackHover('info_box_continue_button')}
          >
            Continue
          </button>
        </div>
      );
    }
  };

  if (currentStep === 'hero') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <img 
                src="https://cdn.shopify.com/s/files/1/0928/4105/0486/files/Screenshot_2025-08-21_at_19.04.18.jpg?v=1755796003"
                alt="Jennifer Walsh - Hair & Scalp Health Expert"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Get your assessment <span className="text-green-500 font-semibold">in just 2 minutes!</span>
            </p>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Struggling with hair loss and thinning?
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
              Get your personalized hair loss assessment and discover what's really causing your thinning - <span className="text-green-500 font-semibold">free analysis</span>.
            </h2>

            <button
              onClick={() => {
                trackEvent('quiz_started', { step: 'hero_button' });
                setCurrentStep('quiz');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors duration-200 shadow-lg flex items-center mx-auto"
            >
              Start Assessment
              <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 shadow-2xl border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Your expert for <span className="text-blue-600">hair restoration</span>.
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex-shrink-0 overflow-hidden shadow-xl ring-4 ring-white">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0928/4105/0486/files/Screenshot_2025-08-21_at_19.04.18.jpg?v=1755796003"
                  alt="Jennifer Walsh - Hair & Scalp Health Expert"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Jennifer Walsh</h4>
                <p className="text-blue-600 font-medium mb-3 sm:mb-4">Hair & Scalp Health Expert</p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Helping people restore their hair and confidence for over 10 years. Whether you're struggling with postpartum hair loss, menopause thinning, or male pattern baldness, I'm here to guide you through understanding what's really happening and find the right solution for your specific situation.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <button
              onClick={() => setCurrentStep('quiz')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors duration-200 shadow-lg flex items-center mx-auto"
            >
              Get Assessment
              <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    const steps = [
      '🧠 Looking at your answers...',
      '⚡ Checking how bad your hair loss is...',
      '📊 Figuring out the best plan for you...',
      '🎯 Finding what will work for your situation...',
      '✅ Making your personal plan...'
    ];

    const progress = ((analysisStep + 1) / steps.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-8">
              <div className="animate-pulse mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧠 Analyzing Your Hair Loss Profile...</h2>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`text-left p-3 rounded-lg transition-all duration-500 ${
                      index <= analysisStep
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      {index < analysisStep && <span className="text-green-500 mr-2">✓</span>}
                      {index === analysisStep && (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      )}
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 mt-6 italic">Creating the perfect plan for your exact situation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    console.log('Showing result page, showResult:', showResult);
    const userAvatar = figureOutAvatar();
    const severity = figureOutSeverity();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {/* 1. SUMMARY SECTION */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Analysis Complete
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Personal Hair Restoration Plan</h1>
              <p className="text-gray-600">Based on your specific situation and hair loss pattern</p>
            </div>

            {/* Severity Indicator */}
            <div className="mb-8">
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-1000 ${
                      severity === 'VERY BAD'
                        ? 'bg-red-500'
                        : severity === 'BAD'
                        ? 'bg-orange-400'
                        : 'bg-yellow-400'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  </div>

                    <h2
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${
                        severity === 'VERY BAD'
                          ? 'text-red-500'
                          : severity === 'BAD'
                          ? 'text-orange-500'
                          : 'text-yellow-600'
                      }`}
                    >
                  {severity}
                    </h2>
                <p className="text-gray-600 text-xs sm:text-sm px-2 sm:px-0">
                      {severity === 'VERY BAD'
                        ? 'Urgent intervention needed'
                        : severity === 'BAD'
                        ? 'Serious but fixable'
                    : severity === 'NOT GOOD'
                    ? 'Manageable with right approach - but can get much worse if not treated'
                    : 'Can get much worse if not treated - act now while it\'s still easy to fix'}
                    </p>
                  </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                </div>
              </div>







            {/* 2. WHAT THIS MEANS SECTION */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Your Next Steps to Hair Restoration</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</div>
                  <p className="text-gray-700">Discover your custom solution below</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</div>
                  <p className="text-gray-700">See real people's hair restoration stories</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</div>
                  <p className="text-gray-700">Start growing your hair back</p>
                </div>
              </div>
            </div>

            {/* 3. YOUR PLAN SECTION */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Hair Restoration Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 text-center transform hover:scale-105 transition-all duration-300 border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {severity === 'VERY BAD' ? '14-21' : severity === 'BAD' ? '21-28' : '28-35'} days
                  </div>
                  <div className="text-sm text-gray-600">Expected hair regrowth time</div>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 text-center transform hover:scale-105 transition-all duration-300 border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {severity === 'VERY BAD' ? '67%' : severity === 'BAD' ? '45%' : '23%'}
                  </div>
                  <div className="text-sm text-gray-600">Risk of permanent loss if untreated</div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${severity === 'VERY BAD' ? '67%' : severity === 'BAD' ? '45%' : '23%'}` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-center transform hover:scale-105 transition-all duration-300 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">94%</div>
                  <div className="text-sm text-gray-600">Success rate with treatment</div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>



            {/* 5. SOCIAL PROOF SECTION */}
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Real People, Real Results
              </h3>

              <div className="space-y-4">
                {/* Testimonial 1 - Blue gradient */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-400 transform hover:scale-102 transition-all duration-300">
                  <p className="text-gray-700 text-sm italic mb-2">"I feel like I have a full head of hair again!"</p>
                  <p className="text-xs text-gray-600 font-medium">- James, 42, Tech Executive</p>
                </div>

                {/* Testimonial 2 - Green gradient */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-400 transform hover:scale-102 transition-all duration-300">
                  <p className="text-gray-700 text-sm italic mb-2">"Hair isn't growing → Hair loss completely stopped in 2 weeks"</p>
                  <p className="text-xs text-gray-600 font-medium">- Sarah, 47, Perimenopause</p>
                </div>

                {/* Testimonial 3 - Blue gradient */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-400 transform hover:scale-102 transition-all duration-300">
                  <p className="text-gray-700 text-sm italic mb-2">"Where'd my bald spots go? I can style my hair and go, go, go"</p>
                  <p className="text-xs text-gray-600 font-medium">- Sales Manager, 38</p>
                </div>

                {/* Testimonial 4 - Green gradient */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-400 transform hover:scale-102 transition-all duration-300">
                  <p className="text-gray-700 text-sm italic mb-2">"I never knew what thick hair felt like until now"</p>
                  <p className="text-xs text-gray-600 font-medium">- Postpartum hair loss survivor</p>
                </div>

                {/* Testimonial 5 - Blue gradient */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-400 transform hover:scale-102 transition-all duration-300">
                  <p className="text-gray-700 text-sm italic mb-2">"Holy grail for my hair loss and regrowth"</p>
                  <p className="text-xs text-gray-600 font-medium">- After trying 20+ hair products</p>
                </div>
              </div>
            </div>

            {/* 5.5. URGENCY SECTION */}
            <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-300">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">⏰</span>
                YOUR WINDOW IS CLOSING - ACT NOW
              </h3>
              
              {/* Dynamic urgency messages based on quiz answers */}
              {answers.biggest_fear === 'Looking old and unattractive' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-l-4 border-red-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💼</span>
                    <div>
                      <p className="text-red-800 font-medium">Your confidence is on the line RIGHT NOW.</p>
                      <p className="text-red-700 text-sm mt-1">While you're reading this, your hair is getting thinner. How many more bad hair days can you afford before it's too late?</p>
                    </div>
                  </div>
                </div>
              )}
              
              {answers.how_long === 'So long I forgot what thick hair feels like' && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-l-4 border-red-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔥</span>
                    <div>
                      <p className="text-red-800 font-medium">You've already lost YEARS to this hair loss.</p>
                      <p className="text-red-700 text-sm mt-1">Every day you wait is another day of hiding under hats. Don't let this steal another month from your confidence.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {answers.how_badly_need === 'DESPERATELY - I can\'t lose any more hair' && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🆘</span>
                    <div>
                      <p className="text-red-800 font-medium">You said you can\'t lose ANY MORE hair.</p>
                      <p className="text-red-700 text-sm mt-1">Then why are you still reading instead of trying it? Every day you delay is another day of hair loss.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {answers.how_long === 'Just started and I\'m panicking' && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚡</span>
                    <div>
                      <p className="text-orange-800 font-medium">You\'re at a CRITICAL window right now.</p>
                      <p className="text-orange-700 text-sm mt-1">Hair loss that\'s \'just started\' means your follicles are still alive. Act NOW while it\'s still easy to reverse.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {answers.how_long === 'Since pregnancy/menopause' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🌡️</span>
                    <div>
                      <p className="text-purple-800 font-medium">Hormonal hair loss gets WORSE if you don\'t address the root cause.</p>
                      <p className="text-purple-800 text-sm mt-1">Your hormones may not return to normal - but your hair CAN.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {answers.biggest_fear === 'Going completely bald' && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🧠</span>
                    <div>
                      <p className="text-indigo-800 font-medium">Every day of hair loss is your follicles crying for help.</p>
                      <p className="text-indigo-700 text-sm mt-1">Research shows DHT damage comes BEFORE permanent baldness. Block the DHT NOW = protect your remaining hair.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Fallback message - always shows if no other conditions match */}
              {!answers.biggest_fear?.includes('Looking old and unattractive') && 
               !answers.how_long?.includes('So long I forgot what thick hair feels like') && 
               !answers.how_badly_need?.includes('DESPERATELY - I can\'t lose any more hair') && 
               !answers.how_long?.includes('Just started') && 
               !answers.how_long?.includes('pregnancy/menopause') && 
               !answers.biggest_fear?.includes('Going completely bald') && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-400">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⏰</span>
                    <div>
                      <p className="text-orange-800 font-medium">Your hair loss won\'t fix itself.</p>
                      <p className="text-orange-700 text-sm mt-1">Every day you wait is another day of thinning. The longer you delay, the harder it gets to reverse. Don\'t let this steal more hair from your head.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. HOW IT WORKS SECTION - Accordion */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 overflow-hidden">
              <button
                onClick={() => setAccordionOpen(prev => ({ ...prev, howItWorks: !prev.howItWorks }))}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                How Natural DHT Blocking Works
              </h3>
                <svg 
                  className={`w-5 h-5 text-blue-600 transition-transform ${accordionOpen.howItWorks ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {accordionOpen.howItWorks && (
                <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🔋</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">Your Problem</h4>
                      <p className="text-sm text-gray-600">DHT hormone is killing your follicles</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">The Solution</h4>
                      <p className="text-sm text-gray-600">Natural DHT blocker stops the damage</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-2">The Result</h4>
                      <p className="text-sm text-gray-600">Hair stops falling, starts growing</p>
                    </div>
                  </div>
            </div>
              )}
            </div>



            {/* Quality Warning */}
            <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <svg className="w-7 h-7 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-bold text-yellow-800">⚠️ 73% of Online Hair Loss Products are FAKE</h3>
              </div>

              <div className="text-center mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-semibold text-sm sm:text-base">
                  Only <strong>Pumpkin Seed Oil from trusted site</strong> is what you need right now - scroll to see the trusted site
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 mb-3 flex items-center text-lg">
                    <span className="mr-2 text-xl">❌</span> Fake & Dangerous
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-red-700 text-sm">Industrial chemicals (not medical grade)</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-red-700 text-sm">Wrong concentrations</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-red-700 text-sm">Heavy metal contamination</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <p className="text-red-700 text-sm">No safety testing</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-700 mb-3 flex items-center text-lg">
                    <span className="mr-2 text-xl">✅</span> Real & Safe
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <p className="text-green-700 text-sm">Pharmaceutical grade quality</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <p className="text-green-700 text-sm">Hospital quality standards</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <p className="text-green-700 text-sm">Lab tested for purity</p>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <p className="text-green-700 text-sm font-semibold">Pumpkin Seed Oil from trusted site</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 animate-slide-in-up border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Real People, Real Results
              </h3>

              <div className="space-y-3">
                <div className="flex items-start bg-white rounded-lg p-3 border border-green-200 animate-slide-in-left transform hover:scale-105 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mr-3 animate-pulse">
                    <span className="text-green-600 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm italic">"I feel like a different person. Never knew what thick hair felt like until now."</p>
                    <p className="text-xs text-gray-500 mt-1">- Sarah, 47</p>
                  </div>
                </div>

                <div className="flex items-start bg-white rounded-lg p-3 border border-blue-200 animate-slide-in-right transform hover:scale-105 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3 animate-pulse">
                    <span className="text-blue-600 font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm italic">"Holy grail for my hair loss. Best investment in my appearance EVER!"</p>
                    <p className="text-xs text-gray-500 mt-1">- Mark, 52</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Warning */}
            {answers.medications?.includes('Yes, I take antidepressants') && (
              <div className="mb-8 bg-red-100 border-2 border-red-400 rounded-xl p-6 animate-shake">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-red-800 mb-2">🚨 IMPORTANT: You Take Antidepressants</h3>
                    <p className="text-red-700 text-sm mb-3">Methylene Blue can cause dangerous interactions with antidepressants.</p>
                    <div className="bg-red-200 rounded-lg p-3">
                      <p className="text-red-800 font-medium text-sm">⚠️ Do NOT use without doctor supervision</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 mb-6 border border-yellow-300">
                <p className="text-yellow-800 font-bold text-lg">
                  🕒 {severity === 'VERY BAD' ? 'TIME IS RUNNING OUT - Your hair needs help NOW' : 'Act while this is still reversible'}
                </p>
              </div>

              {/* Product Image */}
              <div className="mb-6">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0928/4105/0486/files/Kaching-Bundles-2_2.jpg?v=1753103463"
                  alt="Natural Hair Loss Solution Product"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                />
              </div>

                            <a
                              href="https://pumpkinseedoil.co/products/pumpkin-seed-oil"
                              className="block w-full"
                              onClick={handleCTAClick}
                            >
                              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl text-lg sm:text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                ✅ YES - Claim My 50% OFF (Limited Time) →
                              </button>
                            </a>
              
              {/* Low Stock Warning */}
              <div className="text-center mt-3">
                <p className="text-red-600 font-medium text-sm">
                  ⚠️ Low Stock Alert
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-700">
                  <span className="flex items-center"><span className="mr-1">✓</span> Hospital Quality</span>
                  <span className="flex items-center"><span className="mr-1">✓</span> Third-Party Tested</span>
                  <span className="flex items-center"><span className="mr-1">✓</span> Money-Back Guarantee</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  safeGtag('event', 'no_thanks_clicked', {
                    content_name: 'Hair Loss Quiz',
                    quiz_severity: figureOutSeverity(),
                    button_text: 'No thanks, I\'ll keep suffering while Big Pharma profits',
                    time_on_page_seconds: timeOnPage
                  });
                  setShowNoThanksPopup(true);
                }}
                className="w-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-600 font-medium py-2.5 sm:py-3 px-4 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                onMouseEnter={() => trackHover('no_thanks_button')}
              >
                No thanks, I'll keep suffering while Big Pharma profits
              </button>

              {/* No Thanks Popup */}
              {showNoThanksPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Don't Wait Another Day</h3>
                      
                      <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                        Every day you wait is another day of watching your hair disappear. 
                        While you're hesitating, your follicles are getting weaker. 
                        Don't let another month pass by.
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 border-l-4 border-red-400">
                          <p className="text-red-800 font-medium text-sm">⏰ Time is NOT on your side</p>
                          <p className="text-red-700 text-xs mt-1">Every day = more hair lost forever</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border-l-4 border-blue-400">
                          <p className="text-blue-800 font-medium text-sm">💪 You deserve to feel confident again</p>
                          <p className="text-blue-700 text-xs mt-1">Your hair doesn't have to define you</p>
                        </div>
                      </div>

                      <a
                        href="https://pumpkinseedoil.co/products/pumpkin-seed-oil"
                        className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 mb-4 text-sm sm:text-base w-full"
                        onClick={() => trackEvent('popup_interaction', { action: 'product_button_clicked', button_text: 'Start My Hair Restoration' })}
                      >
                        🚀 Start My Hair Restoration Today
                      </a>
                      
                      <p className="text-green-600 text-xs sm:text-sm mb-4 sm:mb-6">(Join thousands who stopped waiting and started growing)</p>

                      <button
                        onClick={() => setShowNoThanksPopup(false)}
                        className="mt-4 sm:mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 text-sm sm:text-base"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">💡 Join thousands who broke free from expensive treatments and got their hair back</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = getAllQuestions();
  const currentQuestion = questions[questionIndex];
  const progress = ((questionIndex + 1) / questions.length) * 100;

  if (currentStep === 'quiz' && currentQuestion) {
    return (
      <div key={`quiz-${questionIndex}`} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-4 pt-4 sm:pt-8 flex items-start justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Profile Image - compact for mobile */}
          <div className="text-center mb-2 sm:mb-3 md:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-2 sm:mb-3 overflow-hidden shadow-xl ring-4 ring-white">
              <img 
                src="https://cdn.shopify.com/s/files/1/0928/4105/0486/files/Screenshot_2025-08-21_at_19.04.18.jpg?v=1755796003"
                alt="Jennifer Walsh - Hair & Scalp Health Expert"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Progress Indicator - compact for mobile */}
          <div className="mb-2 sm:mb-3 md:mb-4">
            <div className="flex justify-center space-x-1 mb-2 sm:mb-3 flex-wrap max-w-md mx-auto">
              {Array.from({ length: questions.length }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-sm transition-all duration-300 ${
                    i <= questionIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Question Container - optimized padding */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-5 md:p-8 lg:p-10">
            {currentQuestion.type === 'question' ? (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 text-center leading-tight">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 text-center text-sm sm:text-base md:text-lg leading-relaxed">
                    {currentQuestion.subtitle}
                  </p>
                )}

                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {currentQuestion.options?.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer((currentQuestion as any).id, option)}
                      onTouchStart={() => handleAnswer((currentQuestion as any).id, option)}
                      className={`w-full text-left p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 touch-manipulation ${
                        selectedAnswer === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-gray-800 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className={`${(currentQuestion as any).bgColor} rounded-2xl p-6 sm:p-8 text-center`}>
                <h2 className={`text-xl sm:text-2xl font-bold ${(currentQuestion as any).textColor} mb-4 sm:mb-6`}>
                  {(currentQuestion as any).title}
                </h2>
                <p className={`${(currentQuestion as any).textColor} text-base sm:text-lg leading-relaxed mb-6 sm:mb-8`}>
                  {(currentQuestion as any).content}
                </p>
                
                {/* Brain Energy Image */}
                {(currentQuestion as any).title === '🧠 Your Brain Uses Tons of Energy' && (
                  <div className="mb-6 sm:mb-8">
                    <img 
                      src="https://cdn.shopify.com/s/files/1/0965/1824/2645/files/20_batteri_brain.jpg?v=1755131090"
                      alt="Brain using 20% of energy - battery visualization"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                    />
                  </div>
                )}
                
                <button 
                  onClick={nextStep}
                  onTouchStart={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center mx-auto touch-manipulation"
                >
                  Continue
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (questionIndex > 0) {
                  setQuestionIndex(questionIndex - 1);
                } else {
                  setCurrentStep('hero');
                }
              }}
              onTouchStart={() => {
                if (questionIndex > 0) {
                  setQuestionIndex(questionIndex - 1);
                } else {
                  setCurrentStep('hero');
                }
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium touch-manipulation"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MethyleneBlueQuiz;