export type OperationType = 'rent_permanent' | 'rent_temporary' | 'rent_room' | 'rent_seasonal' | 'sale';
export type PropertyType = 'apartment' | 'house' | 'penthouse' | 'duplex' | 'studio' | 'room' | 'garage' | 'storage' | 'office' | 'commercial';
export type PropertyStatus = 'available' | 'reserved' | 'rented' | 'sold';
export type AddressVisibility = 'exact' | 'street_only' | 'hidden';
export type KitchenEquipment = 'fully_equipped_furnished' | 'fully_equipped_unfurnished' | 'empty_unfurnished' | 'unknown';
export type HeatingType = 'central' | 'individual' | 'none';
export type HeatingFuel = 'gas' | 'electric' | 'gasoil' | 'other';
export type EnergyClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'exempt' | 'in_progress';
export type Condition = 'new' | 'good' | 'needs_renovation';
export type Orientation = 'north' | 'south' | 'east' | 'west';

export interface Property {
  id: string;

  // Sync externa
  cadastral_reference: string | null;
  idealista_id: string | null;
  idealista_url: string | null;
  internal_reference: string | null;

  // Tipo
  operation_type: OperationType;
  property_type: PropertyType;
  status: PropertyStatus;
  is_attic: boolean;
  is_studio: boolean;
  is_duplex: boolean;
  is_bank_property: boolean;

  // Precio
  price: number;
  community_fees: number | null;
  deposit: number | null;

  // Inquilinos
  max_tenants: number | null;
  children_friendly: boolean;
  allows_pets: boolean;

  // Localización
  address: string | null;
  block_staircase: string | null;
  door: string | null;
  urbanization_name: string | null;
  neighborhood: string | null;
  district: string | null;
  city: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  address_visibility: AddressVisibility;

  // Planta
  floor: number | null;
  is_top_floor: boolean;

  // Tamaño
  size_m2: number | null;
  useful_size_m2: number | null;
  rooms: number | null;
  bathrooms: number | null;

  // Características
  is_exterior: boolean;
  has_elevator: boolean;
  orientation: Orientation[];
  has_air_conditioning: boolean;
  has_terrace: boolean;
  has_balcony: boolean;
  has_built_in_wardrobes: boolean;
  has_garage: boolean;
  has_storage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  accessible_exterior: boolean;
  accessible_interior: boolean;

  // Equipamiento y calefacción
  kitchen_equipment: KitchenEquipment | null;
  heating_type: HeatingType | null;
  heating_fuel: HeatingFuel | null;

  // Edificio
  construction_year: number | null;

  // Energía
  energy_certificate: EnergyClass | null;
  energy_consumption: number | null;
  emissions_certificate: EnergyClass | null;
  emissions_value: number | null;

  // Estado
  condition: Condition | null;

  // Descripción multiidioma
  description_es: string | null;
  description_en: string | null;
  description_fr: string | null;
  description_de: string | null;
  website_url: string | null;

  // Multimedia
  photos: string[];
  main_photo_index: number;
  floor_plan_photos: string[];
  video_url: string | null;
  virtual_tour_url: string | null;

  // Datos internos
  capturing_agent: string | null;
  selling_agent: string | null;
  private_notes: string | null;

  // Control
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Labels en español para la UI
export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  rent_permanent: 'Alquiler vivienda habitual',
  rent_temporary: 'Alquiler temporal',
  rent_room: 'Alquiler de habitación',
  rent_seasonal: 'Alquiler vacacional',
  sale: 'Venta',
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Piso',
  house: 'Casa / Chalet',
  penthouse: 'Ático',
  duplex: 'Dúplex',
  studio: 'Estudio',
  room: 'Habitación',
  garage: 'Garaje',
  storage: 'Trastero',
  office: 'Oficina',
  commercial: 'Local comercial',
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  available: 'Disponible',
  reserved: 'Reservado',
  rented: 'Alquilado',
  sold: 'Vendido',
};

export const KITCHEN_LABELS: Record<KitchenEquipment, string> = {
  fully_equipped_furnished: 'Cocina equipada y casa amueblada',
  fully_equipped_unfurnished: 'Cocina equipada y casa sin amueblar',
  empty_unfurnished: 'Cocina vacía y casa sin amueblar',
  unknown: 'No lo sé',
};
