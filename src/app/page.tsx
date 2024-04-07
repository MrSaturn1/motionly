import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-lg min-h-screen flex justify-center items-center mx-auto pb-32 px-3">
      <section className="my-auto">
        <img src="/brand.svg" className="mx-auto" />
        <p className="font-normal text-2xl my-8 text-center">
          We draft{" "}
          <span className="font-bold text-4xl highlight">
            discovery motions
          </span>{" "}
          for your litigation cases{" "}
          <span className="text-3xl">automagically</span>
        </p>
        <div className="my-4 flex justify-center">
          <Link href="/app" className="btn-blue">
            Start Now
          </Link>
        </div>
      </section>
    </main>
  );
}
