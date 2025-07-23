import { z} from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useUser } from '../hooks/auth/user'
import { useNavigate } from 'react-router-dom'



const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})
const Login = () => {
    const { signin } = useUser();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
       
        signin(values);
    }
    function handleSignIn() {
        const token = localStorage.getItem('token');
        if (token) {
            
            navigate('/home');
        } else {
            navigate('/signin');
        }
    }
  return (
    <div className='w-96 p-6 bg-slate-100 rounded-lg  shadow-2xl'>
    <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                    </FormItem>
                    
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Password" {...field} type="password" />
                        </FormControl>
                    </FormItem>
                )}
            />
            <Button variant="outline" type="submit" className='cursor-pointer mb-2'>Sign up</Button>
            <div className='w-full flex items-center justify-center gap-5'>Already have an account? <Button className='cursor-pointer' onClick={handleSignIn}>Sign in</Button> </div>
        </form>

    </Form>
    </div>
  )
}

export default Login