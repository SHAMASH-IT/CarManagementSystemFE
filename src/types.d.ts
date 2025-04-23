declare module 'react-hook-form' {
  export interface UseFormReturn<T> {
    register: (name: keyof T) => any;
    handleSubmit: (onSubmit: (data: T) => void) => (e?: React.BaseSyntheticEvent) => void;
    formState: {
      errors: {
        [K in keyof T]?: {
          message?: string;
        };
      };
    };
    reset: () => void;
  }

  export function useForm<T>(options?: any): UseFormReturn<T>;
}

declare module '@hookform/resolvers/zod' {
  export function zodResolver(schema: any): any;
} 