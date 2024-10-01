
import '@testing-library/jest-dom';
import { useState, useEffect } from 'react';

function useSeleniumSetup() {
  const [selenium, setSelenium] = useState(null);
  const [verificationErrors, setVerificationErrors] = useState(null);

  useEffect(() => {
    const setupSelenium = () => {
      const newSelenium = new DefaultSelenium("localhost", 4444, "*edge", "http://localhost:3000/");
      newSelenium.Start();
      setSelenium(newSelenium);
      setVerificationErrors(new StringBuilder());
    }

    setupSelenium();

    return () => {
      // Clean up Selenium instance if needed
      if (selenium) {
        selenium.Stop();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return { selenium, verificationErrors };
}

export default useSeleniumSetup;