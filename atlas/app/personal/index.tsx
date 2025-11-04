import { useRouter } from 'expo-router';
import React from 'react';

export default function PersonalIndex() {
  const router = useRouter();

  React.useEffect(() => {
    // navigate to the local 'home' screen in this layout (relative path)
    router.replace(({ pathname: './home' } as unknown) as any);
  }, [router]);

  // this page only redirects to the local home; render nothing
  return null;
}
