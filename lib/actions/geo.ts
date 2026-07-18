"use server";

import bd from 'bangladesh-geo-data';

export async function getGeoDivisions() {
  return bd.getAllDivisions();
}

export async function getGeoDistricts(divisionName: string) {
  if (!divisionName) return [];
  const div = bd.getDivisionByName(divisionName);
  if (!div) return [];
  return bd.getDistrictsByDivision(div.id);
}

export async function getGeoUpazilas(districtName: string) {
  if (!districtName) return [];
  const dist = bd.getDistrictByName(districtName);
  if (!dist) return [];
  return bd.getUpazilasByDistrict(dist.id);
}

export async function getGeoUnions(upazilaName: string) {
  if (!upazilaName) return [];
  const upa = bd.getUpazilaByName(upazilaName);
  if (!upa) return [];
  return bd.getUnionsByUpazila(upa.id);
}
