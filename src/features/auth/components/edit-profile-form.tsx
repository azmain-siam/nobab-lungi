'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfileAction } from '@/features/auth/actions/profile-actions';
import { FormField, FormInput } from '@/components/forms/form-field';
import { AlertMessage } from '@/components/shared/alert-message';
import { Button } from '@/components/ui/button';

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
    <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <AlertMessage variant="error" message={serverError} />}
      {success && <AlertMessage variant="success" message="Profile updated successfully." />}

      <FormField id="profile-name" label="Full name" error={errors.name?.message}>
        <FormInput
          id="profile-name"
          type="text"
          autoComplete="name"
          disabled={isSubmitting}
          {...register('name')}
        />
      </FormField>

      <FormField
        id="profile-phone"
        label="Phone number"
        error={errors.phone?.message}
        hint="Optional — must be a valid Bangladeshi number"
      >
        <FormInput
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          disabled={isSubmitting}
          {...register('phone')}
        />
      </FormField>

      <Button
        id="edit-profile-submit"
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}
