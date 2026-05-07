export const AboutPage = () => {
  return (
    <article className="prose max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Acerca del proyecto</h2>
      <p className="text-slate-700">
        Dream Life Calculator es una aplicación fullstack desarrollada como
        ejercicio de aprendizaje. El objetivo es ayudarte a estimar el salario
        que necesitarías para vivir la vida que deseas, partiendo de tus gastos
        actuales y de tus metas de ahorro, inversión y estilo de vida.
      </p>
      <h3 className="font-semibold text-lg mt-6">Tecnologías</h3>
      <ul className="list-disc pl-5 text-slate-700 space-y-1">
        <li>React + TypeScript + Vite</li>
        <li>Tailwind CSS</li>
        <li>React Router</li>
        <li>Express + Node.js (arquitectura por capas)</li>
        <li>Context API + custom hooks</li>
      </ul>
      <p className="text-sm text-slate-500 mt-6">
        Puedes consultar la documentación completa en la carpeta{' '}
        <code>docs/</code> del repositorio.
      </p>
    </article>
  );
};
