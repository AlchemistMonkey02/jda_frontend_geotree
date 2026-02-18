import React, { useState } from 'react';
import WelcomeStep from './screens/WelcomeStep';
import EaseStep from './screens/EaseStep';
import LegacyStep from './screens/LegacyStep';

const OnboardingFlow = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < 2) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    if (currentSlide === 0) {
        return <WelcomeStep onNext={handleNext} />;
    }

    if (currentSlide === 1) {
        return <EaseStep onNext={handleNext} />;
    }

    if (currentSlide === 2) {
        return <LegacyStep onNext={() => onComplete()} />;
    }

    return null;
};

export default OnboardingFlow;
