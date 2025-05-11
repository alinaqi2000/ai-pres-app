import React from 'react';

import { SelectRoleForm } from '@/components/auth/select-role';
import { FocusAwareStatusBar } from '@/components/ui';

export default function SelectRoleScreen() {
  return (
    <>
      <FocusAwareStatusBar />
      <SelectRoleForm />
    </>
  );
}
