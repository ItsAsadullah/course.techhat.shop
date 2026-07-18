'use client';

import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import Image from 'next/image';

import {
  BadgeCheck,
  Building2,
  Check,
  CreditCard,
  ImageIcon,
  Loader2,
  QrCode,
  Rocket,
  Save,
  Settings2,
  Smartphone,
  Trash2,
  UploadCloud,
  WalletCards,
  X,
} from 'lucide-react';

import { toast } from 'sonner';

import {
  SettingGroup,
  useSettingsStore,
} from '@/lib/store/settings.store';

import { updateSettings } from '@/lib/actions/settings.actions';
import { createClient } from '@/lib/admin/supabase/client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PaymentSettingsFormProps {
  initialGroup: SettingGroup;
}

type ProviderId = 'bkash' | 'nagad' | 'rocket' | 'bangla_qr';

type UploadField =
  | 'bkash_logo_url'
  | 'nagad_logo_url'
  | 'rocket_logo_url'
  | 'bangla_qr_logo_url'
  | 'bangla_qr_image_url';

interface ProviderConfig {
  id: ProviderId;
  name: string;
  banglaName: string;
  description: string;
  banglaDescription: string;
  icon: ReactNode;
  brandColor: string;
  brandSoftColor: string;
  borderColor: string;
  logoKey: UploadField;
  enabledKey: string;
}

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_QR_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'bkash',
    name: 'bKash',
    banglaName: 'বিকাশ',
    description:
      'Configure personal and merchant payment accounts for bKash.',
    banglaDescription:
      'বিকাশ পার্সোনাল ও মার্চেন্ট পেমেন্ট অ্যাকাউন্ট কনফিগার করুন।',
    icon: <Smartphone className="h-5 w-5" />,
    brandColor: 'bg-[#E2136E]',
    brandSoftColor: 'bg-[#E2136E]/10 text-[#E2136E]',
    borderColor: 'border-[#E2136E]/25',
    logoKey: 'bkash_logo_url',
    enabledKey: 'bkash_enabled',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    banglaName: 'নগদ',
    description:
      'Configure your Nagad personal payment account.',
    banglaDescription:
      'নগদ পার্সোনাল পেমেন্ট অ্যাকাউন্ট কনফিগার করুন।',
    icon: <WalletCards className="h-5 w-5" />,
    brandColor: 'bg-[#F15A24]',
    brandSoftColor: 'bg-[#F15A24]/10 text-[#F15A24]',
    borderColor: 'border-[#F15A24]/25',
    logoKey: 'nagad_logo_url',
    enabledKey: 'nagad_enabled',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    banglaName: 'রকেট',
    description:
      'Configure your Rocket personal payment account.',
    banglaDescription:
      'রকেট পার্সোনাল পেমেন্ট অ্যাকাউন্ট কনফিগার করুন।',
    icon: <Rocket className="h-5 w-5" />,
    brandColor: 'bg-[#8C1569]',
    brandSoftColor: 'bg-[#8C1569]/10 text-[#8C1569]',
    borderColor: 'border-[#8C1569]/25',
    logoKey: 'rocket_logo_url',
    enabledKey: 'rocket_enabled',
  },
  {
    id: 'bangla_qr',
    name: 'Bangla QR',
    banglaName: 'বাংলা কিউআর',
    description:
      'Accept interoperable QR payments using your Bangla QR.',
    banglaDescription:
      'বাংলা কিউআর ব্যবহার করে কিউআর পেমেন্ট গ্রহণ করুন।',
    icon: <QrCode className="h-5 w-5" />,
    brandColor: 'bg-emerald-600',
    brandSoftColor: 'bg-emerald-50 text-emerald-700',
    borderColor: 'border-emerald-200',
    logoKey: 'bangla_qr_logo_url',
    enabledKey: 'bangla_qr_enabled',
  },
];

function normalizeBoolean(value: unknown): boolean {
  return (
    value === true ||
    value === 'true' ||
    value === '1' ||
    value === 1
  );
}

function createSafeFileName(file: File) {
  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'png';

  const randomPart = crypto.randomUUID();

  return `${Date.now()}_${randomPart}.${extension}`;
}

function ProviderSwitch({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={[
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none block h-5 w-5 rounded-full bg-white',
          'shadow-sm ring-0 transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}

function ProviderLogo({
  imageUrl,
  name,
  fallback,
  colorClass,
}: {
  imageUrl: string;
  name: string;
  fallback: ReactNode;
  colorClass: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative h-12 w-20 overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
        <Image
          src={imageUrl}
          alt={`${name} logo`}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${colorClass}`}
    >
      {fallback}
    </div>
  );
}

function UploadButton({
  label,
  uploading,
  accept = 'image/*',
  onChange,
}: {
  label: string;
  uploading: boolean;
  accept?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={uploading}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="h-4 w-4" />
        )}

        {uploading ? 'Uploading...' : label}
      </Button>
    </>
  );
}

export function PaymentSettingsForm({
  initialGroup,
}: PaymentSettingsFormProps) {
  const {
    updateSetting,
    draftSettings,
    isDirty,
    clearDirtyFlag,
    activeLanguage,
    setSaveAction,
  } = useSettingsStore();

  const [isPending, startTransition] = useTransition();

  const [uploadingField, setUploadingField] =
    useState<UploadField | null>(null);

  const [activeProvider, setActiveProvider] =
    useState<ProviderId>('bkash');

  const supabase = useMemo(() => createClient(), []);

  const isBn = activeLanguage === 'bn';

  const getValue = useCallback(
    (key: string): string => {
      const draftValue = draftSettings[key];

      if (draftValue !== undefined) {
        return String(draftValue ?? '');
      }

      const initialSetting = initialGroup.settings.find(
        (setting) => setting.key === key,
      );

      return String(initialSetting?.value ?? '');
    },
    [draftSettings, initialGroup.settings],
  );

  const isProviderEnabled = useCallback(
    (provider: ProviderConfig) => {
      return normalizeBoolean(getValue(provider.enabledKey));
    },
    [getValue],
  );

  const handleSave = useCallback(async () => {
    const payload = Object.keys(draftSettings).map((key) => ({
      key,
      value: draftSettings[key] ?? null,
    }));

    if (payload.length === 0) {
      return;
    }

    const result = await updateSettings(initialGroup.id, payload);

    if (result.success) {
      toast.success(
        isBn
          ? 'পেমেন্ট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে'
          : 'Payment settings updated successfully',
      );

      clearDirtyFlag();

      return;
    }

    toast.error(
      isBn
        ? `সেটিংস সংরক্ষণ করা যায়নি: ${result.error}`
        : `Failed to update settings: ${result.error}`,
    );
  }, [
    clearDirtyFlag,
    draftSettings,
    initialGroup.id,
    isBn,
  ]);

  useEffect(() => {
    setSaveAction(handleSave);

    return () => {
      setSaveAction(() => Promise.resolve());
    };
  }, [handleSave, setSaveAction]);

  const validateImage = useCallback(
    (
      file: File,
      field: UploadField,
    ): string | null => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return isBn
          ? 'শুধুমাত্র PNG, JPG, WEBP অথবা SVG ছবি আপলোড করুন।'
          : 'Only PNG, JPG, WEBP or SVG images are allowed.';
      }

      const isQrImage = field === 'bangla_qr_image_url';

      const maxSize = isQrImage ? MAX_QR_SIZE : MAX_LOGO_SIZE;

      if (file.size > maxSize) {
        return isBn
          ? `ছবির সাইজ সর্বোচ্চ ${isQrImage ? '৫MB' : '২MB'
          } হতে পারবে।`
          : `Maximum file size is ${isQrImage ? '5MB' : '2MB'
          }.`;
      }

      return null;
    },
    [isBn],
  );

  const uploadImage = useCallback(
    async (
      file: File,
      field: UploadField,
      folder: string,
    ) => {
      const validationError = validateImage(file, field);

      if (validationError) {
        toast.error(validationError);
        return;
      }

      setUploadingField(field);

      try {
        const fileName = createSafeFileName(file);

        const filePath = `payment/${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        if (!publicUrlData.publicUrl) {
          throw new Error('Unable to generate public image URL.');
        }

        updateSetting(field, publicUrlData.publicUrl);

        toast.success(
          isBn
            ? 'ছবি সফলভাবে আপলোড হয়েছে'
            : 'Image uploaded successfully',
        );
      } catch (error) {
        console.error('Payment image upload error:', error);

        const message =
          error instanceof Error
            ? error.message
            : 'Unknown upload error';

        toast.error(
          isBn
            ? `ছবি আপলোড করা যায়নি: ${message}`
            : `Failed to upload image: ${message}`,
        );
      } finally {
        setUploadingField(null);
      }
    },
    [
      isBn,
      supabase,
      updateSetting,
      validateImage,
    ],
  );

  const handleImageUpload = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      field: UploadField,
      folder: string,
    ) => {
      const file = event.target.files?.[0];

      event.target.value = '';

      if (!file) {
        return;
      }

      void uploadImage(file, field, folder);
    },
    [uploadImage],
  );

  const removeImage = useCallback(
    (field: UploadField) => {
      updateSetting(field, '');

      toast.success(
        isBn
          ? 'ছবিটি সেটিংস থেকে সরানো হয়েছে'
          : 'Image removed from settings',
      );
    },
    [isBn, updateSetting],
  );

  const activeProviderConfig =
    PROVIDERS.find(
      (provider) => provider.id === activeProvider,
    ) ?? PROVIDERS[0];

  const renderBkashSettings = () => {
    const provider = PROVIDERS[0];

    const enabled = isProviderEnabled(provider);

    return (
      <ProviderSettingsShell
        provider={provider}
        enabled={enabled}
        isBn={isBn}
        logoUrl={getValue(provider.logoKey)}
        uploadingLogo={uploadingField === provider.logoKey}
        onEnabledChange={(value) =>
          updateSetting(provider.enabledKey, String(value))
        }
        onLogoUpload={(event) =>
          handleImageUpload(
            event,
            provider.logoKey,
            'logos/bkash',
          )
        }
        onLogoRemove={() => removeImage(provider.logoKey)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <PaymentInput
            label={
              isBn
                ? 'বিকাশ পার্সোনাল নম্বর'
                : 'bKash Personal Number'
            }
            description={
              isBn
                ? 'Send Money পেমেন্ট গ্রহণের নম্বর'
                : 'Number used to receive Send Money payments'
            }
            value={getValue('bkash_personal_number')}
            onChange={(value) =>
              updateSetting('bkash_personal_number', value)
            }
            placeholder="017XXXXXXXX"
            disabled={!enabled}
          />

          <PaymentInput
            label={
              isBn
                ? 'বিকাশ মার্চেন্ট নম্বর'
                : 'bKash Merchant Number'
            }
            description={
              isBn
                ? 'Payment অপশনের মাধ্যমে পেমেন্ট গ্রহণের নম্বর'
                : 'Merchant number used for Payment transactions'
            }
            value={getValue('bkash_merchant_number')}
            onChange={(value) =>
              updateSetting('bkash_merchant_number', value)
            }
            placeholder="01XXXXXXXXX"
            disabled={!enabled}
          />
        </div>

        <div className="mt-5 rounded-xl border border-pink-100 bg-pink-50/60 p-4 dark:border-pink-950 dark:bg-pink-950/20">
          <p className="text-sm font-semibold text-[#E2136E]">
            {isBn
              ? 'বিকাশ পেমেন্ট নির্দেশনা'
              : 'bKash payment configuration'}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {isBn
              ? 'পার্সোনাল নম্বর Checkout-এ Send Money হিসেবে এবং মার্চেন্ট নম্বর Payment হিসেবে দেখানো যাবে।'
              : 'The personal number can be shown as Send Money and the merchant number as Payment during checkout.'}
          </p>
        </div>
      </ProviderSettingsShell>
    );
  };

  const renderNagadSettings = () => {
    const provider = PROVIDERS[1];

    const enabled = isProviderEnabled(provider);

    return (
      <ProviderSettingsShell
        provider={provider}
        enabled={enabled}
        isBn={isBn}
        logoUrl={getValue(provider.logoKey)}
        uploadingLogo={uploadingField === provider.logoKey}
        onEnabledChange={(value) =>
          updateSetting(provider.enabledKey, String(value))
        }
        onLogoUpload={(event) =>
          handleImageUpload(
            event,
            provider.logoKey,
            'logos/nagad',
          )
        }
        onLogoRemove={() => removeImage(provider.logoKey)}
      >
        <PaymentInput
          label={
            isBn
              ? 'নগদ পার্সোনাল নম্বর'
              : 'Nagad Personal Number'
          }
          description={
            isBn
              ? 'নগদ Send Money পেমেন্ট গ্রহণের নম্বর'
              : 'Number used to receive Nagad Send Money payments'
          }
          value={getValue('nagad_personal_number')}
          onChange={(value) =>
            updateSetting('nagad_personal_number', value)
          }
          placeholder="017XXXXXXXX"
          disabled={!enabled}
        />
      </ProviderSettingsShell>
    );
  };

  const renderRocketSettings = () => {
    const provider = PROVIDERS[2];

    const enabled = isProviderEnabled(provider);

    return (
      <ProviderSettingsShell
        provider={provider}
        enabled={enabled}
        isBn={isBn}
        logoUrl={getValue(provider.logoKey)}
        uploadingLogo={uploadingField === provider.logoKey}
        onEnabledChange={(value) =>
          updateSetting(provider.enabledKey, String(value))
        }
        onLogoUpload={(event) =>
          handleImageUpload(
            event,
            provider.logoKey,
            'logos/rocket',
          )
        }
        onLogoRemove={() => removeImage(provider.logoKey)}
      >
        <PaymentInput
          label={
            isBn
              ? 'রকেট পার্সোনাল নম্বর'
              : 'Rocket Personal Number'
          }
          description={
            isBn
              ? 'রকেট Send Money পেমেন্ট গ্রহণের নম্বর'
              : 'Number used to receive Rocket payments'
          }
          value={getValue('rocket_personal_number')}
          onChange={(value) =>
            updateSetting('rocket_personal_number', value)
          }
          placeholder="01XXXXXXXXX"
          disabled={!enabled}
        />
      </ProviderSettingsShell>
    );
  };

  const renderBanglaQrSettings = () => {
    const provider = PROVIDERS[3];

    const enabled = isProviderEnabled(provider);

    const qrImageUrl = getValue('bangla_qr_image_url');

    return (
      <ProviderSettingsShell
        provider={provider}
        enabled={enabled}
        isBn={isBn}
        logoUrl={getValue(provider.logoKey)}
        uploadingLogo={uploadingField === provider.logoKey}
        onEnabledChange={(value) =>
          updateSetting(provider.enabledKey, String(value))
        }
        onLogoUpload={(event) =>
          handleImageUpload(
            event,
            provider.logoKey,
            'logos/bangla-qr',
          )
        }
        onLogoRemove={() => removeImage(provider.logoKey)}
      >
        <div
          className={[
            'rounded-2xl border p-5',
            !enabled && 'pointer-events-none opacity-50',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <QrCode className="h-5 w-5" />
            </div>

            <div>
              <h4 className="font-semibold">
                {isBn
                  ? 'পেমেন্ট কিউআর কোড'
                  : 'Payment QR Code'}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                {isBn
                  ? 'কাস্টমার Checkout থেকে এই কিউআর কোড স্ক্যান করে পেমেন্ট করবে।'
                  : 'Customers will scan this QR code from the checkout payment screen.'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-slate-50 p-5 dark:bg-slate-950">
              {qrImageUrl ? (
                <>
                  <div className="relative h-56 w-56">
                    <Image
                      src={qrImageUrl}
                      alt="Bangla QR payment code"
                      fill
                      sizes="224px"
                      className="object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage('bangla_qr_image_url')
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-background text-red-500 shadow-sm transition hover:bg-red-50"
                    aria-label="Remove QR code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                    <QrCode className="h-8 w-8" />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    {isBn
                      ? 'কোনো কিউআর কোড নেই'
                      : 'No QR code uploaded'}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG অথবা WEBP
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <Label className="text-base font-semibold">
                {qrImageUrl
                  ? isBn
                    ? 'কিউআর কোড পরিবর্তন করুন'
                    : 'Replace QR Code'
                  : isBn
                    ? 'বাংলা কিউআর আপলোড করুন'
                    : 'Upload Bangla QR'}
              </Label>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {isBn
                  ? 'আপনার ব্যাংক বা পেমেন্ট প্রতিষ্ঠানের দেওয়া পরিষ্কার বাংলা কিউআর ইমেজ আপলোড করুন। Checkout পেজ এবং QR Popup-এ এই ছবিটি ব্যবহার করা হবে।'
                  : 'Upload a clear Bangla QR image provided by your bank or payment provider. This image will be used on checkout and inside the QR payment popup.'}
              </p>

              <div className="mt-5">
                <UploadButton
                  label={
                    qrImageUrl
                      ? isBn
                        ? 'নতুন কিউআর আপলোড'
                        : 'Upload New QR'
                      : isBn
                        ? 'কিউআর আপলোড করুন'
                        : 'Upload QR Code'
                  }
                  uploading={
                    uploadingField === 'bangla_qr_image_url'
                  }
                  onChange={(event) =>
                    handleImageUpload(
                      event,
                      'bangla_qr_image_url',
                      'qr-codes',
                    )
                  }
                />
              </div>

              <div className="mt-5 rounded-xl border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-sm font-medium">
                      {isBn
                        ? 'কিউআর ইমেজ নির্দেশনা'
                        : 'QR image recommendation'}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {isBn
                        ? 'স্কয়ার, পরিষ্কার এবং উচ্চ রেজোলিউশনের কিউআর ব্যবহার করুন। QR-এর চারপাশ কেটে ফেলবেন না। সর্বোচ্চ ফাইল সাইজ ৫MB।'
                        : 'Use a clear, square, high-resolution QR image. Do not crop the quiet area around the QR code. Maximum file size is 5MB.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProviderSettingsShell>
    );
  };

  const renderActiveProvider = () => {
    switch (activeProviderConfig.id) {
      case 'bkash':
        return renderBkashSettings();

      case 'nagad':
        return renderNagadSettings();

      case 'rocket':
        return renderRocketSettings();

      case 'bangla_qr':
        return renderBanglaQrSettings();

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-gradient-to-r from-card via-card to-muted/30 p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {isBn
                    ? 'পেমেন্ট পদ্ধতি ও গেটওয়ে'
                    : 'Payment Methods & Gateway'}
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {isBn
                    ? 'Checkout পেজে কোন পেমেন্ট পদ্ধতি দেখানো হবে, পেমেন্ট নম্বর, লোগো এবং বাংলা কিউআর এখান থেকে পরিচালনা করুন।'
                    : 'Manage checkout payment methods, payment numbers, provider logos and Bangla QR configuration.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-3">
              <Settings2 className="h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs font-medium">
                  {isBn
                    ? 'পেমেন্ট কনফিগারেশন'
                    : 'Payment Configuration'}
                </p>

                <p className="text-[11px] text-muted-foreground">
                  {PROVIDERS.filter((provider) =>
                    isProviderEnabled(provider),
                  ).length}{' '}
                  {isBn ? 'টি পদ্ধতি সক্রিয়' : 'methods active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b bg-muted/20 p-3 lg:min-h-[680px] lg:border-b-0 lg:border-r">
            <p className="px-3 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {isBn ? 'পেমেন্ট পদ্ধতি' : 'Payment Methods'}
            </p>

            <div className="space-y-1.5">
              {PROVIDERS.map((provider) => {
                const active = activeProvider === provider.id;

                const enabled = isProviderEnabled(provider);

                const logoUrl = getValue(provider.logoKey);

                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setActiveProvider(provider.id)}
                    className={[
                      'group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left',
                      'transition-all duration-200',
                      active
                        ? 'border-border bg-background shadow-sm'
                        : 'border-transparent hover:border-border hover:bg-background/70',
                    ].join(' ')}
                  >
                    <ProviderLogo
                      imageUrl={logoUrl}
                      name={provider.name}
                      fallback={provider.icon}
                      colorClass={provider.brandColor}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {isBn
                          ? provider.banglaName
                          : provider.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${enabled
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                            }`}
                        />

                        <span className="text-[11px] text-muted-foreground">
                          {enabled
                            ? isBn
                              ? 'সক্রিয়'
                              : 'Active'
                            : isBn
                              ? 'নিষ্ক্রিয়'
                              : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {active ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border bg-background/60 p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <p className="text-xs leading-5 text-muted-foreground">
                  {isBn
                    ? 'শুধুমাত্র সক্রিয় পেমেন্ট পদ্ধতিগুলো Checkout পেজে দেখানো উচিত।'
                    : 'Only enabled payment methods should be displayed on the checkout page.'}
                </p>
              </div>
            </div>
          </aside>

          <main className="min-w-0 p-4 sm:p-6 lg:p-7">
            {renderActiveProvider()}
          </main>
        </div>
      </div>

      <div className="sticky bottom-4 z-30">
        <div className="flex flex-col gap-4 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={[
                'flex h-10 w-10 items-center justify-center rounded-xl',
                isDirty
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
              ].join(' ')}
            >
              {isDirty ? (
                <Settings2 className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium">
                {isDirty
                  ? isBn
                    ? 'আপনার পরিবর্তন সংরক্ষণ করা হয়নি'
                    : 'You have unsaved changes'
                  : isBn
                    ? 'সব পরিবর্তন সংরক্ষিত'
                    : 'All changes are saved'}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {isDirty
                  ? isBn
                    ? 'পরিবর্তন কার্যকর করতে সেটিংস সংরক্ষণ করুন।'
                    : 'Save settings to apply your changes.'
                  : isBn
                    ? 'পেমেন্ট কনফিগারেশন আপ টু ডেট।'
                    : 'Payment configuration is up to date.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            disabled={!isDirty || isPending}
            onClick={() => {
              startTransition(() => {
                void handleSave();
              });
            }}
            className="min-h-11 gap-2 px-7 shadow-sm"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {isPending
              ? isBn
                ? 'সংরক্ষণ হচ্ছে...'
                : 'Saving...'
              : isBn
                ? 'পেমেন্ট সেটিংস সংরক্ষণ'
                : 'Save Payment Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProviderSettingsShellProps {
  provider: ProviderConfig;
  enabled: boolean;
  isBn: boolean;
  logoUrl: string;
  uploadingLogo: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onLogoUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onLogoRemove: () => void;
  children: ReactNode;
}

function ProviderSettingsShell({
  provider,
  enabled,
  isBn,
  logoUrl,
  uploadingLogo,
  onEnabledChange,
  onLogoUpload,
  onLogoRemove,
  children,
}: ProviderSettingsShellProps) {
  return (
    <div className="space-y-6">
      <div
        className={`overflow-hidden rounded-2xl border ${provider.borderColor}`}
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProviderLogo
              imageUrl={logoUrl}
              name={provider.name}
              fallback={provider.icon}
              colorClass={provider.brandColor}
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold">
                  {isBn
                    ? provider.banglaName
                    : provider.name}
                </h3>

                <span
                  className={[
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                    enabled
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800',
                  ].join(' ')}
                >
                  {enabled
                    ? isBn
                      ? 'সক্রিয়'
                      : 'ACTIVE'
                    : isBn
                      ? 'নিষ্ক্রিয়'
                      : 'DISABLED'}
                </span>
              </div>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {isBn
                  ? provider.banglaDescription
                  : provider.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border bg-background px-4 py-3 sm:justify-start">
            <div>
              <p className="text-sm font-medium">
                {isBn
                  ? 'Checkout-এ দেখান'
                  : 'Show on Checkout'}
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {enabled
                  ? isBn
                    ? 'পেমেন্ট পদ্ধতি সক্রিয়'
                    : 'Payment method enabled'
                  : isBn
                    ? 'পেমেন্ট পদ্ধতি বন্ধ'
                    : 'Payment method disabled'}
              </p>
            </div>

            <ProviderSwitch
              enabled={enabled}
              onChange={onEnabledChange}
            />
          </div>
        </div>
      </div>

      <div
        className={[
          'rounded-2xl border bg-card p-5 sm:p-6',
          !enabled && 'opacity-60',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${provider.brandSoftColor}`}
            >
              <ImageIcon className="h-5 w-5" />
            </div>

            <div>
              <h4 className="font-semibold">
                {isBn
                  ? 'পেমেন্ট লোগো'
                  : 'Payment Method Logo'}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                {isBn
                  ? 'Checkout এবং পেমেন্ট পেজে এই লোগো দেখানো হবে।'
                  : 'This logo will be displayed on checkout and payment pages.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <UploadButton
              label={
                logoUrl
                  ? isBn
                    ? 'লোগো পরিবর্তন'
                    : 'Replace Logo'
                  : isBn
                    ? 'লোগো আপলোড'
                    : 'Upload Logo'
              }
              uploading={uploadingLogo}
              onChange={onLogoUpload}
            />

            {logoUrl ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onLogoRemove}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove payment logo"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}

interface PaymentInputProps {
  label: string;
  description: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function PaymentInput({
  label,
  description,
  value,
  placeholder,
  disabled,
  onChange,
}: PaymentInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="relative">
        <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="tel"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              event.target.value
                .replace(/[^\d+]/g, '')
                .slice(0, 14),
            )
          }
          placeholder={placeholder}
          className="h-11 pl-10 font-mono"
        />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}