export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* KHÔNG có Navbar / Footer ở đây */}
            {children}
        </>
    );
}
