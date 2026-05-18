import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Heart,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria privada · Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminGaleriaPage,
});

interface Album {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  is_preview: boolean;
  requires_contribution: boolean;
  suggested_contribution_cents: number | null;
  created_at: string;
}

interface Photo {
  id: string;
  album_id: string;
  storage_path: string;
  file_name: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  sort_order: number;
  is_preview: boolean;
  created_at: string;
}

const BUCKET = "wedding-photos";

function AdminGaleriaPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // Create album dialog
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [savingAlbum, setSavingAlbum] = useState(false);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  // Delete confirmations
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  // Auth check
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (!s) {
        setIsAdmin(false);
        setAuthChecked(true);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: isAllowed } = await supabase.rpc("has_role", {
        _user_id: data.session.user.id,
        _role: "admin",
      });
      if (!isAllowed) {
        await supabase.auth.signOut();
        toast.error("Sem permissões.");
        navigate({ to: "/" });
        return;
      }
      setIsAdmin(true);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Load albums
  useEffect(() => {
    if (!isAdmin) return;
    setLoadingAlbums(true);
    supabase
      .from("wedding_albums")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Erro a carregar álbuns.");
        else setAlbums((data ?? []) as Album[]);
        setLoadingAlbums(false);
      });
  }, [isAdmin]);

  // Load photos for selected album
  useEffect(() => {
    if (!selectedAlbum) {
      setPhotos([]);
      setPhotoUrls({});
      return;
    }
    setLoadingPhotos(true);
    supabase
      .from("wedding_photos")
      .select("*")
      .eq("album_id", selectedAlbum.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          toast.error("Erro a carregar fotos.");
          setLoadingPhotos(false);
          return;
        }
        const list = (data ?? []) as Photo[];
        setPhotos(list);
        // Sign URLs in batch
        if (list.length > 0) {
          const paths = list.map((p) => p.storage_path);
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrls(paths, 3600);
          const urls: Record<string, string> = {};
          signed?.forEach((s, i) => {
            if (s.signedUrl) urls[list[i].id] = s.signedUrl;
          });
          setPhotoUrls(urls);
        }
        setLoadingPhotos(false);
      });
  }, [selectedAlbum]);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || `album-${Date.now()}`;
  }

  async function createAlbum() {
    if (!newTitle.trim()) {
      toast.error("Dá um nome ao álbum.");
      return;
    }
    setSavingAlbum(true);
    const slug = `${slugify(newTitle)}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase
      .from("wedding_albums")
      .insert({
        slug,
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        sort_order: albums.length,
      })
      .select()
      .single();
    setSavingAlbum(false);
    if (error || !data) {
      toast.error("Erro ao criar álbum.");
      return;
    }
    toast.success("✨ Álbum criado");
    setAlbums((prev) => [...prev, data as Album]);
    setCreatingOpen(false);
    setNewTitle("");
    setNewDescription("");
    setSelectedAlbum(data as Album);
  }

  async function togglePublished(album: Album) {
    const next = !album.is_published;
    const { error } = await supabase
      .from("wedding_albums")
      .update({ is_published: next })
      .eq("id", album.id);
    if (error) return toast.error("Erro a atualizar.");
    setAlbums((prev) =>
      prev.map((a) => (a.id === album.id ? { ...a, is_published: next } : a)),
    );
    if (selectedAlbum?.id === album.id) {
      setSelectedAlbum({ ...selectedAlbum, is_published: next });
    }
    toast.success(next ? "Pronto para futuro lançamento" : "Voltou a privado");
  }

  async function deleteAlbum() {
    if (!albumToDelete) return;
    // Delete storage files first
    const { data: alphotos } = await supabase
      .from("wedding_photos")
      .select("storage_path")
      .eq("album_id", albumToDelete.id);
    if (alphotos && alphotos.length > 0) {
      await supabase.storage
        .from(BUCKET)
        .remove(alphotos.map((p: { storage_path: string }) => p.storage_path));
    }
    const { error } = await supabase
      .from("wedding_albums")
      .delete()
      .eq("id", albumToDelete.id);
    if (error) {
      toast.error("Erro ao eliminar.");
      return;
    }
    setAlbums((prev) => prev.filter((a) => a.id !== albumToDelete.id));
    if (selectedAlbum?.id === albumToDelete.id) setSelectedAlbum(null);
    setAlbumToDelete(null);
    toast.success("Álbum eliminado");
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!selectedAlbum) return;
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: arr.length });
    const newPhotos: Photo[] = [];
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${selectedAlbum.id}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });
        if (upErr) throw upErr;

        // Get image dimensions
        const dims = await getImageDimensions(file).catch(() => null);

        const { data: row, error: insErr } = await supabase
          .from("wedding_photos")
          .insert({
            album_id: selectedAlbum.id,
            storage_path: path,
            file_name: file.name,
            size_bytes: file.size,
            mime_type: file.type,
            width: dims?.width ?? null,
            height: dims?.height ?? null,
            sort_order: photos.length + newPhotos.length,
          })
          .select()
          .single();
        if (insErr || !row) throw insErr;
        newPhotos.push(row as Photo);
      } catch (e) {
        console.error(e);
        toast.error(`Falhou: ${file.name}`);
      }
      setUploadProgress({ done: i + 1, total: arr.length });
    }
    // Sign URLs for new photos
    if (newPhotos.length > 0) {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(
          newPhotos.map((p) => p.storage_path),
          3600,
        );
      const urls: Record<string, string> = { ...photoUrls };
      signed?.forEach((s, i) => {
        if (s.signedUrl) urls[newPhotos[i].id] = s.signedUrl;
      });
      setPhotoUrls(urls);
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
    setUploading(false);
    setUploadProgress({ done: 0, total: 0 });
    if (newPhotos.length > 0) toast.success(`✨ ${newPhotos.length} foto(s) carregada(s)`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function getImageDimensions(
    file: File,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("dimensions"));
      };
      img.src = url;
    });
  }

  async function deletePhoto() {
    if (!photoToDelete) return;
    await supabase.storage.from(BUCKET).remove([photoToDelete.storage_path]);
    const { error } = await supabase
      .from("wedding_photos")
      .delete()
      .eq("id", photoToDelete.id);
    if (error) {
      toast.error("Erro ao eliminar.");
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete.id));
    setPhotoToDelete(null);
    toast.success("Foto eliminada");
  }

  async function togglePhotoPreview(photo: Photo) {
    const next = !photo.is_preview;
    const { error } = await supabase
      .from("wedding_photos")
      .update({ is_preview: next })
      .eq("id", photo.id);
    if (error) return toast.error("Erro a atualizar.");
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, is_preview: next } : p)),
    );
  }

  const totalPhotos = useMemo(
    () => albums.reduce((sum) => sum, 0) + photos.length,
    [albums, photos.length],
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin
            </Link>
            <div className="h-8 w-px bg-border" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Privado
              </p>
              <h1 className="font-display text-2xl text-primary truncate">
                Galeria de fotos
              </h1>
            </div>
          </div>
          <Button onClick={() => setCreatingOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Novo álbum
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Privacy + future-payments banner */}
        <div
          className="mb-8 p-5 rounded-md border flex items-start gap-3"
          style={{
            background: "color-mix(in oklab, var(--gold) 10%, transparent)",
            borderColor: "color-mix(in oklab, var(--gold) 40%, transparent)",
          }}
        >
          <Heart
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: "var(--gold)" }}
          />
          <div className="text-sm leading-relaxed">
            <p className="font-medium mb-1">
              Esta galeria está privada e oculta dos convidados.
            </p>
            <p className="text-muted-foreground">
              Estrutura preparada para um futuro sistema de contribuições via
              Stripe (<em>“Contribui para desbloquear o nosso álbum”</em>) —
              ainda desativado. Quando estiveres pronta, podemos ativar o
              pagamento e publicar a galeria.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Albums list */}
          <aside>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Álbuns ({albums.length})
            </p>
            {loadingAlbums ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : albums.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-md p-6 text-center text-sm text-muted-foreground">
                Ainda sem álbuns.
                <br />
                Cria o primeiro.
              </div>
            ) : (
              <ul className="space-y-2">
                {albums.map((a) => {
                  const active = selectedAlbum?.id === a.id;
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => setSelectedAlbum(a)}
                        className="w-full text-left p-3 rounded-md border transition-all group"
                        style={{
                          borderColor: active ? "var(--gold)" : "var(--border)",
                          background: active
                            ? "color-mix(in oklab, var(--gold) 8%, transparent)"
                            : "var(--card)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-base text-foreground truncate">
                              {a.title}
                            </p>
                            {a.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {a.description}
                              </p>
                            )}
                          </div>
                          {a.is_published ? (
                            <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Photos area */}
          <section>
            {!selectedAlbum ? (
              <div className="bg-card border border-dashed border-border rounded-md p-16 text-center">
                <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Seleciona um álbum à esquerda ou cria um novo.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl text-foreground">
                      {selectedAlbum.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {photos.length} foto(s) ·{" "}
                      {selectedAlbum.is_published ? "marcado para futuro lançamento" : "privado"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(selectedAlbum)}
                    >
                      {selectedAlbum.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" /> Tornar privado
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" /> Marcar para lançamento
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAlbumToDelete(selectedAlbum)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Eliminar álbum
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          A carregar {uploadProgress.done}/{uploadProgress.total}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" /> Carregar fotos
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/avif"
                      multiple
                      hidden
                      onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                    />
                  </div>
                </div>

                {loadingPhotos ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </div>
                ) : photos.length === 0 ? (
                  <div
                    className="bg-card border border-dashed border-border rounded-md p-12 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Clica para carregar as primeiras fotos
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      JPG, PNG, WebP, HEIC, AVIF · até 25MB cada
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {photos.map((p) => (
                      <figure
                        key={p.id}
                        className="group relative aspect-square overflow-hidden rounded-md bg-muted border border-border"
                      >
                        {photoUrls[p.id] ? (
                          <img
                            src={photoUrls[p.id]}
                            alt={p.caption ?? p.file_name ?? "foto"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => togglePhotoPreview(p)}
                              title={p.is_preview ? "Remover do preview" : "Usar como preview"}
                              className="p-1.5 rounded bg-white/90 hover:bg-white text-foreground"
                            >
                              {p.is_preview ? (
                                <Eye className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => setPhotoToDelete(p)}
                              title="Eliminar"
                              className="p-1.5 rounded bg-white/90 hover:bg-destructive hover:text-white text-foreground transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {p.is_preview && (
                            <span className="self-start text-[10px] uppercase tracking-[0.2em] bg-white/95 text-foreground px-2 py-0.5 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Create album dialog */}
      <AlertDialog open={creatingOpen} onOpenChange={setCreatingOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Novo álbum</AlertDialogTitle>
            <AlertDialogDescription>
              Os álbuns ficam privados até decidires publicá-los.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Nome
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex.: Cerimónia, Festa, Pré-wedding..."
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Descrição (opcional)
              </label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Uma breve descrição do momento"
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingAlbum}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={createAlbum} disabled={savingAlbum}>
              {savingAlbum ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Criar álbum"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete album confirm */}
      <AlertDialog
        open={!!albumToDelete}
        onOpenChange={(v) => !v && setAlbumToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar álbum?</AlertDialogTitle>
            <AlertDialogDescription>
              Vais eliminar <strong>{albumToDelete?.title}</strong> e todas as
              fotos dentro dele. Esta ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAlbum}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete photo confirm */}
      <AlertDialog
        open={!!photoToDelete}
        onOpenChange={(v) => !v && setPhotoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta foto será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePhoto}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
