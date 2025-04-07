import React from 'react';

function Home() {
  return (
    <div>
      <button onClick={() => window.location.href = '/addrecipe'}>Add Recipe</button>
    </div>
  );
}

export default Home;
