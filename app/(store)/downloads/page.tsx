import { DownloadsPanel } from "@/components/downloads/DownloadsPanel";


export default function DownloadsPage() {

  return (
    <main
      className="
        mx-auto
        max-w-6xl
        space-y-8
        px-6
        py-10
      "
    >

      <div>
        <h1 className="
          text-3xl
          font-bold
          text-white
        ">
          Downloads
        </h1>

        <p className="
          mt-2
          text-zinc-400
        ">
          Manage your game installations.
        </p>
      </div>


      <DownloadsPanel />

    </main>
  );
}