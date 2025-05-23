import { useState } from 'react';
import './App.css';

function App() {
  const [intention, setIntention] = useState('');
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // State to toggle video visibility
  const [videoUrl, setVideoUrl] = useState('');

  // Ensure buttons and guidance boxes do not overlap and maintain their individual states
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGuidance('');
    setVideoUrl('');

    try {
      const response = await fetch('http://localhost:5000/mindfulness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intention }),
      });

      const data = await response.json();
      if (response.ok) {
        setGuidance(data.guidance);
        setVideoUrl(''); // Clear video URL logic related to user feelings

        const newButton = document.createElement('button');
        newButton.textContent = intention || 'Click Me for Guidance';
        newButton.style.position = 'absolute';
        newButton.style.top = `${Math.random() * 80 + 10}%`;
        newButton.style.left = `${Math.random() * 80 + 10}%`;
        newButton.style.transform = 'translate(-50%, -50%)';
        newButton.style.backgroundColor = '#9c9078';
        newButton.style.color = '#dac3a9';
        newButton.style.border = 'none';
        newButton.style.borderRadius = '8px';
        newButton.style.padding = '0.6em 1.2em';
        newButton.style.cursor = 'pointer';
        newButton.style.zIndex = '10';

        let isDragging = false;
        let offsetX, offsetY;

        newButton.addEventListener('mousedown', (e) => {
          isDragging = true;
          offsetX = e.clientX - newButton.getBoundingClientRect().left;
          offsetY = e.clientY - newButton.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            newButton.style.left = `${e.clientX - offsetX}px`;
            newButton.style.top = `${e.clientY - offsetY}px`;
            newButton.style.transform = 'none';
          }
        });

        document.addEventListener('mouseup', () => {
          isDragging = false;
        });

        newButton.addEventListener('click', () => {
          const existingGuidance = document.querySelector(`[data-guidance-for="${intention}"]`);
          if (existingGuidance) {
            existingGuidance.remove();
          }

          const guidanceElement = document.createElement('div');
          guidanceElement.style.position = 'absolute';
          guidanceElement.style.top = newButton.style.top;
          guidanceElement.style.left = newButton.style.left;
          guidanceElement.style.transform = 'translate(-50%, -50%)';
          guidanceElement.style.backgroundColor = '#dac3a9';
          guidanceElement.style.color = '#3e4640';
          guidanceElement.style.padding = '1em';
          guidanceElement.style.borderRadius = '8px';
          guidanceElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          guidanceElement.style.maxWidth = '500px';
          guidanceElement.style.maxHeight = '500px';
          guidanceElement.style.overflow = 'auto';
          guidanceElement.style.cursor = 'move';
          guidanceElement.style.pointerEvents = 'none';
          guidanceElement.textContent = data.guidance || 'No guidance available';
          guidanceElement.setAttribute('data-guidance-for', intention);

          guidanceElement.style.overflowY = 'auto';
          guidanceElement.style.pointerEvents = 'auto';

          let isDragging = false;

          guidanceElement.addEventListener('mousedown', () => {
            isDragging = false;
          });

          guidanceElement.addEventListener('mousemove', () => {
            isDragging = true;
          });

          guidanceElement.addEventListener('mouseup', (event) => {
            if (isDragging) {
              event.preventDefault();
              isDragging = false;
            }
          });

          const collapseButton = document.createElement('button');
          collapseButton.textContent = 'Collapse';
          collapseButton.style.marginTop = '1em';
          collapseButton.style.backgroundColor = '#9c9078';
          collapseButton.style.color = '#dac3a9';
          collapseButton.style.border = 'none';
          collapseButton.style.borderRadius = '8px';
          collapseButton.style.padding = '0.4em 0.8em';
          collapseButton.style.cursor = 'pointer';

          collapseButton.addEventListener('click', () => {
            guidanceElement.remove();
            newButton.style.display = 'block';
          });

          guidanceElement.appendChild(collapseButton);
          document.body.appendChild(guidanceElement);

          newButton.style.display = 'none';
        });

        document.body.appendChild(newButton);
      } else {
        setGuidance('Failed to fetch guidance. Please try again.');
      }
    } catch (error) {
      setGuidance('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (guidance) {
      // Check if the note already exists
      const noteExists = notes.some(note => note.content === guidance);
      if (!noteExists) {
        const title = `Note ${notes.length + 1}`;
        const caption = intention || 'No caption provided';
        setNotes([...notes, { title, caption, content: guidance, video: videoUrl }]); // Save video URL with the note
      } else {
        alert('This note has already been saved.');
      }
    }
  };

  const handleDelete = (index) => {
    setNotes(notes.filter((_, i) => i !== index)); // Remove the note at the specified index
  };

  return (
    <div className="container">
      <h1>Welcome to Mindfulness</h1>
      <p>Break the algorithm, take a deep breath and relax.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="How are you feeling?"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Finding Your Moment of Calm...' : 'Get Guidance'}
        </button>
      </form>

      <button onClick={() => setShowVideo(!showVideo)}>
        {showVideo ? 'Hide Mindfulness Video' : 'Click Me!'}
      </button>
      {showVideo && (
        <div style={{ marginTop: '1em' }}>
          <h2>Mindfulness Video</h2>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/tybOi4hjZFQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {notes.length > 0 && (
        <div>
          <button onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          {showNotes && (
            <div className="notes">
              <h2>Your Notes</h2>
              <ul>
                {notes.map((note, index) => (
                  <li key={index}>
                    <h3>{note.title}</h3>
                    <p><strong>Caption:</strong> {note.caption}</p>
                    <p>{note.content}</p>
                    {note.video && (
                      <div style={{ marginTop: '1em' }}>
                        <iframe
                          width="560"
                          height="315"
                          src={note.video}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
