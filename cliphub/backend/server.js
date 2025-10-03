import express from "express";
import cors from "cors";

// Importar rotas
import empresasRoutes from "./empresas.js";
import clipadoresRoutes from "./clipadores.js";
import jobsRoutes from "./jobs.js";
import pagamentosRoutes from "./pagamentos.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/empresas", empresasRoutes);
app.use("/clipadores", clipadoresRoutes);
app.use("/jobs", jobsRoutes);
app.use("/pagamentos", pagamentosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
