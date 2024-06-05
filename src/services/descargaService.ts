import { PrismaClient } from '@prisma/client';
import { getCurrentDateISO } from '../utils/dateUtils';

const prisma = new PrismaClient();

interface CheckDateResult {
    exists: boolean;
    date: Date;
}

export async function checkCurrentDateInDescarga(): Promise<CheckDateResult> {
    const currentDate: string = getCurrentDateISO();

    console.log('currentDate', currentDate);

    try {
        const result = await prisma.descarga.findUnique({
            where: {
                fecha: new Date(currentDate)
            }
        });

        if (result) {
            console.log('La fecha actual existe en la tabla descarga:', result);
            return { exists: true, date: new Date(currentDate) };
        } else {
            console.log('La fecha actual no existe en la tabla descarga.');
            return { exists: false, date: new Date(currentDate) };
        }
    } catch (error) {
        console.error('Error al consultar la tabla descarga:', error);
        return { exists: false, date: new Date(currentDate) };
    } finally {
        await prisma.$disconnect();
    }
}

export async function insertDescarga(OrdenDeInicio: string): Promise<void> {
    const currentDate: string = getCurrentDateISO();

    try {
        await prisma.descarga.create({
            data: {
                fecha: new Date(currentDate),
                OrdenDeInicio: OrdenDeInicio,
            },
        });
        console.log('Registro insertado correctamente.');
    } catch (error) {
        console.error('Error al insertar el registro en la tabla descarga:', error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function insertOrdenCompra(orderDetails: any, date: Date): Promise<void> {
    try {
        await prisma.ordenCompra.create({
            data: {
                versionIdentifier: orderDetails.versionIdentifier,
                C_NumeroOrdenCompra: orderDetails.C_NumeroOrdenCompra,
                C_IdProvOrdenCompra: orderDetails.C_IdProvOrdenCompra,
                C_IdClaseDocumentoCompra: orderDetails.C_IdClaseDocumentoCompra,
                C_DesClaseDocumentoCompra: orderDetails.C_DesClaseDocumentoCompra,
                C_NumeroPedidoVentas: orderDetails.C_NumeroPedidoVentas,
                C_NumeroClienteOC: orderDetails.C_NumeroClienteOC,
                C_IdOrganizacionCompras: orderDetails.C_IdOrganizacionCompras,
                C_DesOrganizacionCompras: orderDetails.C_DesOrganizacionCompras,
                C_IdGrupoCompras: orderDetails.C_IdGrupoCompras,
                C_DesGrupoCompras: orderDetails.C_DesGrupoCompras,
                C_IdMoneda: orderDetails.C_IdMoneda,
                C_FechaCreacion_OC: BigInt(orderDetails.C_FechaCreacion_OC),
                C_ObservacionesOrdenCompra: orderDetails.C_ObservacionesOrdenCompra,
                MPR_IdAgrupacionProveedor: orderDetails.MPR_IdAgrupacionProveedor,
                MPR_RutProveedor: orderDetails.MPR_RutProveedor,
                MPR_RazonSocialProveedor: orderDetails.MPR_RazonSocialProveedor,
                MPR_Calle: orderDetails.MPR_Calle,
                MPR_NumCalle: orderDetails.MPR_NumCalle,
                MPR_Poblacion: orderDetails.MPR_Poblacion,
                MPR_IdPais: orderDetails.MPR_IdPais,
                MPR_Region: orderDetails.MPR_Region,
                MPR_PaisDesc: orderDetails.MPR_PaisDesc,
                MPR_RegionDesc: orderDetails.MPR_RegionDesc,
                MC_RazonSocialFerreteria: orderDetails.MC_RazonSocialFerreteria,
                MC_RutFerreteria: orderDetails.MC_RutFerreteria,
                V_IdCondicionExpedicion: orderDetails.V_IdCondicionExpedicion,
                V_DesCondicionExpedicion: orderDetails.V_DesCondicionExpedicion,
                MPR_IdCondicionPago: orderDetails.MPR_IdCondicionPago,
                MPR_DenCondicionPago: orderDetails.MPR_DenCondicionPago,
                V_NumReferenciaPedVenta: orderDetails.V_NumReferenciaPedVenta,
                MC_IdDesMercancia: orderDetails.MC_IdDesMercancia,
                MC_DireccionDestMercancia: orderDetails.MC_DireccionDestMercancia,
                MC_DesCiudad: orderDetails.MC_DesCiudad,
                MC_IdPaisFerreteria: orderDetails.MC_IdPaisFerreteria,
                MC_DenPais: orderDetails.MC_DenPais,
                MC_IDRegion: orderDetails.MC_IDRegion,
                MC_DenRegion: orderDetails.MC_DenRegion,
                MC_DesComuna: orderDetails.MC_DesComuna,
                MC_DestipoDestMercancia: orderDetails.MC_DestipoDestMercancia,
                C_IdTransportista: orderDetails.C_IdTransportista,
                C_NombreTransportista: orderDetails.C_NombreTransportista,
                C_DireccionTransportista: orderDetails.C_DireccionTransportista,
                C_TelefTransportista: orderDetails.C_TelefTransportista,
                C_PersonaContacto: orderDetails.C_PersonaContacto,
                C_IdPersonaContacto: orderDetails.C_IdPersonaContacto,
                C_IdEjecutivoChilemat: orderDetails.C_IdEjecutivoChilemat,
                C_NombreEjecutivoCHM: orderDetails.C_NombreEjecutivoCHM,
                C_Vtext: orderDetails.C_Vtext,
                V_TipoDeDistribucion: orderDetails.V_TipoDeDistribucion,
                V_DesTipoDeDistribucion: orderDetails.V_DesTipoDeDistribucion,
                C_FechaGeneracion_OC: BigInt(orderDetails.C_FechaGeneracion_OC),
                C_HoraGeneracion_OC: BigInt(orderDetails.C_HoraGeneracion_OC),
                MPR_IdRegionMaterial: orderDetails.MPR_IdRegionMaterial,
                MPR_DesRegionMaterial: orderDetails.MPR_DesRegionMaterial,
                MPR_IdDistritoMaterial: orderDetails.MPR_IdDistritoMaterial,
                MPR_DesDistritoMaterial: orderDetails.MPR_DesDistritoMaterial,
                C_EstadoOC: orderDetails.C_EstadoOC,
                C_IdEstadoOC: orderDetails.C_IdEstadoOC,
                to_DetalleOC: orderDetails.to_DetalleOC,
                to_MailEjecutivo: orderDetails.to_MailEjecutivo,
                to_Mails: orderDetails.to_Mails,
                to_Montos: orderDetails.to_Montos,
                to_Telefonos: orderDetails.to_Telefonos,
                descargaFecha: date,
            },
        });
        console.log('OrdenCompra insertada correctamente.');
    } catch (error) {
        console.error('Error al insertar la OrdenCompra en la tabla:', error);
    }
}

export async function insertPosicionOrdenCompra(orderItems: any[], C_NumeroOrdenCompra: string): Promise<void> {
    try {
        for (const item of orderItems) {
            await prisma.posicionOrdenCompra.create({
                data: {
                    C_NumeroOrdenCompra: C_NumeroOrdenCompra,
                    C_PosicionOrdenCompra: item.C_PosicionOrdenCompra,
                    C_IdMaterialOrdenCompra: item.C_IdMaterialOrdenCompra,
                    C_CantidadPedido: item.C_CantidadPedido,
                    C_UMPedido: item.C_UMPedido,
                    C_DesUMPedido: item.C_DesUMPedido,
                    C_DesMaterialOrdenCompra: item.C_DesMaterialOrdenCompra,
                    C_DocComercialOrdenCompra: item.C_DocComercialOrdenCompra,
                    MC_IdFerreteria: item.MC_IdFerreteria,
                    C_IdMoneda: item.C_IdMoneda,
                    MPR_IdMaterialProveedor: item.MPR_IdMaterialProveedor,
                    C_IdTipoMaterial: item.C_IdTipoMaterial,
                    C_DesTipoMaterial: item.C_DesTipoMaterial,
                    MPR_MedidaMaterial: item.MPR_MedidaMaterial,
                    C_PrecioUnitarioOC: item.C_PrecioUnitarioOC,
                    C_ValorBrutoOC: item.C_ValorBrutoOC,
                    C_DescMaterial1OC: item.C_DescMaterial1OC,
                    C_DescMaterial2OC: item.C_DescMaterial2OC,
                    C_Descmaterial3OC: item.C_Descmaterial3OC,
                    C_Descmaterial4OC: item.C_Descmaterial4OC,
                    C_Descmaterial5OC: item.C_Descmaterial5OC,
                    C_Descmaterial6OC: item.C_Descmaterial6OC,
                    C_Descmaterial7OC: item.C_Descmaterial7OC,
                    C_Descmaterial8OC: item.C_Descmaterial8OC,
                    C_Descmaterial9OC: item.C_Descmaterial9OC,
                    C_Descmaterial10OC: item.C_Descmaterial10OC,
                    C_OfertaMaterial1OC: item.C_OfertaMaterial1OC,
                    C_OfertaMaterial2OC: item.C_OfertaMaterial2OC,
                    C_PrecioNetoPosicionOC: item.C_PrecioNetoPosicionOC,
                    C_PrecioNetoPosicionOCS: item.C_PrecioNetoPosicionOCS,
                    C_ValorNetoPosicionOC: item.C_ValorNetoPosicionOC,
                    C_ValorNetoPosicionOCS: item.C_ValorNetoPosicionOCS,
                    C_DesFinancieroOC: item.C_DesFinancieroOC,
                    C_IdEstadoPosOC: item.C_IdEstadoPosOC,
                    C_EstadoPosOC: item.C_EstadoPosOC,
                },
            });
        }
        console.log('Posiciones de OrdenCompra insertadas correctamente.');
    } catch (error) {
        console.error('Error al insertar las Posiciones de OrdenCompra en la tabla:', error);
    }
}

export async function getSmallestOrderNumberByDate(date: Date): Promise<string | null> {
    try {

        console.log('date', date)

        const smallestOrder = await prisma.ordenCompra.findFirst({
            where: {
                descarga: {
                    fecha: date
                }
            },
            orderBy: {
                C_NumeroOrdenCompra: 'asc'
            },
            select: {
                C_NumeroOrdenCompra: true
            }
        });

        return smallestOrder?.C_NumeroOrdenCompra || null;
    } catch (error) {
        console.error('Error al obtener el número más pequeño de OrdenCompra:', error);
        return null;
    }
}