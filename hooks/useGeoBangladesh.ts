"use client";

import { useState, useEffect } from "react";
import { getGeoDivisions, getGeoDistricts, getGeoUpazilas, getGeoUnions } from "@/lib/actions/geo";

export function useGeoBangladesh(selectedDivision?: string, selectedDistrict?: string, selectedUpazila?: string) {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [unions, setUnions] = useState<any[]>([]);

  const [loadingDiv, setLoadingDiv] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [loadingUpa, setLoadingUpa] = useState(false);
  const [loadingUni, setLoadingUni] = useState(false);

  useEffect(() => {
    setLoadingDiv(true);
    getGeoDivisions().then(data => {
      setDivisions(data);
      setLoadingDiv(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      return;
    }
    setLoadingDist(true);
    getGeoDistricts(selectedDivision).then(data => {
      setDistricts(data);
      setLoadingDist(false);
    });
  }, [selectedDivision]);

  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      return;
    }
    setLoadingUpa(true);
    getGeoUpazilas(selectedDistrict).then(data => {
      setUpazilas(data);
      setLoadingUpa(false);
    });
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedUpazila) {
      setUnions([]);
      return;
    }
    setLoadingUni(true);
    getGeoUnions(selectedUpazila).then(data => {
      setUnions(data);
      setLoadingUni(false);
    });
  }, [selectedUpazila]);

  return {
    divisions,
    districts,
    upazilas,
    unions,
    loadingDiv,
    loadingDist,
    loadingUpa,
    loadingUni,
  };
}
