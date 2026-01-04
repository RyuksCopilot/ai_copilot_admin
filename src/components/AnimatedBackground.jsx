export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
    </div>
  );
}