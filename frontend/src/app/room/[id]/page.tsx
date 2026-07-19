import { Metadata } from 'next';
import RoomUI from './RoomUI';

type Props = {
  params: any
};

// Fetch room topic for SEO metadata (Link Previews)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const id = p.id;
  let title = "Meet: Private Room";

  try {
    const res = await fetch(`http://localhost:8080/api/rooms/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.topic) {
        title = `Meet: ${data.topic}`;
      }
    }
  } catch (err) {
    console.error("Failed to fetch room metadata:", err);
  }

  return {
    title,
    openGraph: {
      title,
      description: "Join this 1-on-1 P2P video call.",
    },
  };
}

export default async function RoomPage({ params }: Props) {
  const p = await params;
  const id = p.id;
  let topic = "";

  try {
    const res = await fetch(`http://localhost:8080/api/rooms/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      topic = data.topic || "";
    }
  } catch (err) {
    console.error("Failed to fetch room topic:", err);
  }

  return (
    <RoomUI roomId={id} initialTopic={topic} />
  );
}
