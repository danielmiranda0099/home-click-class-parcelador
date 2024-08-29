import { Card, CardContent } from "@/components/ui/card";

// Import all icons
import * as Icons from "@/components/icons";
export default function IconsPage() {
  // Get all icon names
  const iconNames = Object.keys(Icons);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {iconNames.map((iconName) => {
        const IconComponent = Icons[iconName];
        return (
          <Card
            key={iconName}
            className="flex flex-col items-center justify-center p-4"
          >
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4">
                <IconComponent className="w-12 h-12" />
              </div>
              <p className="text-sm font-medium text-center">{iconName}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
