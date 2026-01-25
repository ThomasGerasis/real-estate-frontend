import { menuService } from '@/lib/api';

export default async function MenuExample() {
  const menu = await menuService.getHeaderMenu();

  return (
    <nav>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            <a href={item.url}>{item.label}</a>
            {item.children && item.children.length > 0 && (
              <ul>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a href={child.url}>{child.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
