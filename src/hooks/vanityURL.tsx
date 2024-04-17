
import { useEffect, useState } from 'react';

const useVanityUrl = () => {
  const [vanity, setVanity] = useState(" ");

  useEffect(() => {
    
    if (typeof window !== "undefined") {
      const storedVanity = localStorage.getItem('vanity');
      console.log(storedVanity,"fromlocal")
      if (storedVanity) {
        setVanity(storedVanity);
      }
    }
  }, []);

  return vanity;
};

export default useVanityUrl;
