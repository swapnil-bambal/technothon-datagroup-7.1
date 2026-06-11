import NdaCreator from "@/components/NdaCreator";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Mutual NDA Creator
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Fill in the key details below and the completed Mutual Non-Disclosure
          Agreement updates live on the right. When you&rsquo;re happy with it,
          download a PDF. Based on the{" "}
          <a
            href="https://commonpaper.com/standards/mutual-nda/1.0/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline"
          >
            Common Paper Mutual NDA
          </a>{" "}
          (CC BY 4.0).
        </p>
      </header>
      <NdaCreator />
    </main>
  );
}
