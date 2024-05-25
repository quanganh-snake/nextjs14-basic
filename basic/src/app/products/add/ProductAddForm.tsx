'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
// import { useTokenApp } from "@/app/contexts/AppProvider";
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { CreateProductBody, CreateProductBodyType } from '@/schemaValidations/product.schema';
import productApiRequest from '@/apiRequest/product.api';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import Image from 'next/image';

export default function ProductAddForm() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  // const { setSessionToken } = useTokenApp();
  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      image: '',
    },
  });

  async function onSubmit(values: CreateProductBodyType) {
    try {
      const result = await productApiRequest.create(values);
      toast({
        title: result.payload.message,
      });
      router.push('/products');
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError, duration: 2000 });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate={true}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Tên sản phẩm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* END: Tên sản phẩm */}

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Giá" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* END: Giá */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* END: Mô tả */}

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange('http://localhost:3000/' + file.name);
                    }
                  }}
                  placeholder="Ảnh"
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* END: Giá */}

        {file && (
          <div>
            <Image src={URL.createObjectURL(file)} alt="image" width={200} height={200} />
            <Button size={'sm'} variant={'destructive'}>
              Xóa ảnh
            </Button>
          </div>
        )}

        <Button type="submit">Lưu</Button>
      </form>
    </Form>
  );
}
