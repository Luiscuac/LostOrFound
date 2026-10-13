import type { LostItem } from '@/types';

export const mockItems: LostItem[] = [
  {
    id: 'item-1',
    name: 'Mochila negra con laptop',
    description:
      'Mochila negra marca Targus encontrada en el aula 302 del edificio de Ing. de Sistemas. En su interior contiene una laptop Dell gris, un cargador y una libreta de apuntes de cálculo.',
    category: 'Mochilas/Bolsos',
    status: 'Disponible',
    imageUrl:
      'https://images.pexels.com/photos/5827880/pexels-photo-5827880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/5827880/pexels-photo-5827880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5827873/pexels-photo-5827873.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Aula 302, Edificio de Ing. de Sistemas',
    foundDate: '2026-10-10',
    claimant: null,
  },
  {
    id: 'item-2',
    name: 'Audifonos Bluetooth',
    description:
      'Audifonos inalambricos color blanco con su estuche de carga. Encontrados sobre una banca en el patio central del campus. Funcionan correctamente.',
    category: 'Electronicos',
    status: 'Disponible',
    imageUrl:
      'https://images.pexels.com/photos/33797659/pexels-photo-33797659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/33797659/pexels-photo-33797659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/7417547/pexels-photo-7417547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Banca, Patio Central del Campus',
    foundDate: '2026-10-11',
    claimant: null,
  },
  {
    id: 'item-3',
    name: 'Billetera con documentos',
    description:
      'Billetera de cuero marron encontrada en la cafetería. Contiene documentos de identidad, tarjetas bancarias y una cantidad menor de efectivo. Se solicita al propietario presentar su CI para reclamar.',
    category: 'Documentos',
    status: 'Reclamado',
    imageUrl:
      'https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/7742505/pexels-photo-7742505.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Cafetería Central, mesa 5',
    foundDate: '2026-10-08',
    claimant: {
      ci: '7890123',
      fullName: 'María Fernanda Choque Mamani',
      carrera: 'Ingeniería Civil',
      phone: '70123456',
      returnedAt: '2026-10-09T14:30:00',
    },
  },
  {
    id: 'item-4',
    name: 'Chamarra azul oscuro',
    description:
      'Chamarra de color azul oscuro, marca North Face, talla M. Olvidada en las gradas del campo de futbol. En buen estado, con una small etiqueta interior con iniciales "J.P.".',
    category: 'Ropa',
    status: 'Disponible',
    imageUrl:
      'https://images.pexels.com/photos/9367504/pexels-photo-9367504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/9367504/pexels-photo-9367504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Gradas, Campo de Futbol del Campus',
    foundDate: '2026-10-07',
    claimant: null,
  },
  {
    id: 'item-5',
    name: 'Manojo de llaves',
    description:
      'Manojo de 4 llaves con un llavero de plástico azul. Encontrado en la Biblioteca Central, sobre la mesa de la sala de estudio 2.',
    category: 'Llaves',
    status: 'Reclamado',
    imageUrl:
      'https://images.pexels.com/photos/114741/pexels-photo-114741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/114741/pexels-photo-114741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/67094/pexels-photo-67094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Biblioteca Central, Sala de Estudio 2',
    foundDate: '2026-10-05',
    claimant: {
      ci: '6543210',
      fullName: 'José Luis Mamani Quispe',
      carrera: 'Arquitectura',
      phone: '76543210',
      returnedAt: '2026-10-06T10:15:00',
    },
  },
  {
    id: 'item-6',
    name: 'Cadena de plata',
    description:
      'Cadena de plata con un dije pequeño. Encontrada en el baño del primer piso del edificio de Derecho. No se identificó al propietario.',
    category: 'Otros',
    status: 'Disponible',
    imageUrl:
      'https://images.pexels.com/photos/19288675/pexels-photo-19288675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/19288675/pexels-photo-19288675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    location: 'Baño, Primer Piso, Edificio de Derecho',
    foundDate: '2026-10-12',
    claimant: null,
  },
];
