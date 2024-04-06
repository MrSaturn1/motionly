import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-lg mx-auto py-12">
      <img src="/brand.svg" className="mx-auto" />
      <p className="font-normal text-2xl my-8 text-center">
        We draft{" "}
        <span className="font-bold text-4xl highlight">discovery motions</span>{" "}
        for your litigation cases{" "}
        <span className="text-3xl">automagically</span>
      </p>
      <div className="my-4 flex justify-center">
        <Link
          href="/app"
          className="bg-[#1009f6] hover:bg-[#121212] transition-all ease-in font-bold text-white rounded-full py-3 px-5"
        >
          Start Now
        </Link>
      </div>
    </main>
  );
}
