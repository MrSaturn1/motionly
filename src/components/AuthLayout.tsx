export default function AuthLayout({ children }: any) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <img src="/brand.svg" />
        <p className="text-sm">Draft motions automagically</p>
        {children}
      </div>
    </div>
  );
}
