'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfileAction } from '@/features/auth/actions/profile-actions';

const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(\+880|0)?1[3-9]\d{8}$/, 'Enter a valid Bangladeshi phone number')
    .or(z.literal('')),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  initialName: string;
  initialPhone: string;
}

export function EditProfileForm({ initialName, initialPhone }: EditProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: initialName, phone: initialPhone },
  });

  async function onSubmit(values: EditProfileFormValues) {
    setServerError(null);
    setSuccess(false);
    const result = await updateProfileAction(values.name, values.phone);
    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <form
      id="edit-profile-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {serverError && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          id="profile-name"
          type="text"
          autoComplete="name"
          {...register('name')}
          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700">
          Phone number{' '}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          {...register('phone')}
          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          placeholder="01XXXXXXXXX"
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <button
        id="edit-profile-submit"
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
