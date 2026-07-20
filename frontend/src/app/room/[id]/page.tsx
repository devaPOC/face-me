import { Metadata } from 'next';
import RoomUI from './RoomUI';

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ creator?: string }>
};

// Fetch room topic for SEO metadata (Link Previews)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const id = p.id;
  let topicName = "";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const res = await fetch(`${backendUrl}/api/rooms/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.topic) {
        topicName = data.topic;
      }
    }
  } catch (err) {
    console.error("Failed to fetch room metadata:", err);
  }

  const title = topicName ? `Join "${topicName}"` : "Join Private Call";
  const description = topicName
    ? `You are invited to join the private 1-on-1 video room "${topicName}" on FaceMe.`
    : "You are invited to a private, zero-persistence 1-on-1 WebRTC video call on FaceMe.";
  const roomUrl = `https://faceme.switchspace.in/room/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: roomUrl,
    },
    openGraph: {
      type: "website",
      url: roomUrl,
      title: `${title} | FaceMe`,
      description,
      siteName: "FaceMe",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "FaceMe — Join Private Video Call Preview Card",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | FaceMe`,
      description,
      images: ["/og-image.png"],
    },
  };
}


export default async function RoomPage({ params, searchParams }: Props) {
  const p = await params;
  const s = await searchParams;
  const id = p.id;
  const isCreator = s?.creator === 'true';
  let topic = "";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const res = await fetch(`${backendUrl}/api/rooms/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      topic = data.topic || "";
    }
  } catch (err) {
    console.error("Failed to fetch room topic:", err);
  }

  return (
    <RoomUI roomId={id} initialTopic={topic} isCreator={isCreator} />
  );
}
