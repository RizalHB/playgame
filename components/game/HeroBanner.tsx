import Image from "next/image";

interface HeroBannerProps {
  title: string;
  bannerUrl: string;
}

export function HeroBanner({
  title,
  bannerUrl,
}: HeroBannerProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <Image
        src={bannerUrl}
        alt={title}
        width={1280}
        height={720}
        className="h-[320px] w-full object-cover"
        priority
      />
    </div>
  );
}