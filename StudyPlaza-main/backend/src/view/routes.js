import { Router } from "express";
import userRoutes from "./usersRoutes.js";
import municipiosRoutes from "./municipiosRoutes.js"
import estadosRoutes from "./estadosRoutes.js"
import dependenciasRoutes from "./dependenciaRoutes.js"
import authRoutes from "./authRoutes.js"
import clientes from "./clientesRoutes.js";
import rolesRoutes from "./rolesRoutes.js";
import usersRoles from "./usersRolesRoutes.js";
import alunosRoles from "./alunosRoutes.js";
import cursosRoutes from "./cursosRoutes.js";
import inscricoesRoutes from "./inscricoesRoutes.js";
import gruposRoutes from "./gruposRoutes.js";
import usuariosGruposRoutes from "./usuariosGruposRoutes.js";

const swRoutes = Router();

swRoutes.use(userRoutes);

swRoutes.use(clientes) ;
swRoutes.use(alunosRoles) ;
swRoutes.use( authRoutes) ;

swRoutes.use(municipiosRoutes);
swRoutes.use( estadosRoutes);
swRoutes.use(dependenciasRoutes);
swRoutes.use( rolesRoutes);
swRoutes.use( usersRoles);
swRoutes.use( cursosRoutes);
swRoutes.use( usuariosGruposRoutes);
swRoutes.use( gruposRoutes);
swRoutes.use( inscricoesRoutes);

export default swRoutes;